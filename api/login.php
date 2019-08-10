<?php
include("config.php");

$id = $_POST["id"];
$token = $_POST["token"];
$name = $_POST["name"];
$email = $_POST["email"];
$avatar = $_POST["avatar"];
$config = $_POST["config"];
$time = $_POST["time"];

$user = mysqli_query($conn, "SELECT * FROM `user` WHERE `email` = '$email' LIMIT 1");
if(mysqli_num_rows($user)){
  $data = mysqli_fetch_object($user);
  $time = mysqli_query($conn, "UPDATE `user` SET `last_active` = '$time', `token` = '$token' WHERE `user`.`email` = '$email';");

  if($config){
    $add = mysqli_query($conn, "UPDATE `user` SET `config` = '$config' WHERE `user`.`email` = '$email';");
  }
}else{
  $add = mysqli_query($conn, "INSERT INTO `user` (`id`, `email`, `name`, `avatar`, `config`, `token`, `registered_at`, `last_active`) VALUES (NULL, '$email', '$name', '$avatar', '$config', '$token', '$time', '$time')");
  $data = true;
}

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization");
header('Content-Type: application/json');
echo json_encode($data);
?>
