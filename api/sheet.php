<?php
include("config.php");

$id = $_POST["id"];
$title = $_POST["title"];
$time = $_POST["time"];

if($id == "LAST_ACCESSED"){
  $sheet = mysqli_query($conn, "SELECT * FROM `sheet` Order by accessed_at desc LIMIT 1");
  $id = mysqli_fetch_array($sheet)[0];
}

$sheet = mysqli_query($conn, "SELECT * FROM `sheet` WHERE `id` = $id LIMIT 1");


if(mysqli_num_rows($sheet)){
  $update_accessed_at = mysqli_query($conn, "UPDATE `sheet` SET `accessed_at` = $time WHERE `id` = $id;");

  if($title){
    $update = mysqli_query($conn, "UPDATE `sheet` SET `title` = '".addslashes($title)."' WHERE `id` = $id;");
  }else{
    $data = mysqli_fetch_object($sheet);
    $lines = mysqli_query($conn, "SELECT line_key, date, text FROM `line` WHERE `sheet_id` = '$id' order by pos asc LIMIT 10");

    $lineArray = array();
    while($line = mysqli_fetch_object($lines)){
      array_push($lineArray, $line);
    }
    $data->lines = $lineArray;
  }

}else{
  //$add = mysqli_query($conn, "INSERT INTO `user` (`id`, `email`, `name`, `avatar`, `config`) VALUES (NULL, '$email', '$name', '$avatar', '$config')");
  $data = false;
}

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization");
header('Content-Type: application/json');
echo json_encode($data);
?>
