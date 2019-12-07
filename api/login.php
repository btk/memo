<?php
ini_set('session.gc_maxlifetime', 2592000);
session_set_cookie_params(2592000);
ini_set('session.cookie_domain', '.usememo.com' );
session_start();
include("config.php");

$type = $_GET["type"];

$userId = $_SESSION['user_id'];
$user = mysqli_query($conn, "SELECT * FROM `user` WHERE `id` = '$userId' LIMIT 1");
if(mysqli_num_rows($user)){
  $data = mysqli_fetch_object($user);
  $time = time();
  $update = mysqli_query($conn, "UPDATE `user` SET `last_active` = '$time' WHERE `id` = '$userId';");

  $data->session_id = session_id();
}

if($type == "development"){
  header("Access-Control-Allow-Origin: http://localhost:3000", true);
}else{
  header("Access-Control-Allow-Origin: https://app.usememo.com", true);  
}
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization");
header('Content-Type: application/json');
echo json_encode($data);

?>
