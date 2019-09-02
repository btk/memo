<?php
session_id($_POST["session_id"]);
session_start();
include("config.php");

$user_id = $_SESSION['user_id'];

if($user_id){

  $id = $_POST["id"];
  $title = $_POST["title"];
  $time = $_POST["time"];
  $formatted_time = $_POST["formatted_time"];
  $action = $_POST["action"];

  if($action == "archive"){
    $update = mysqli_query($conn, "UPDATE `sheet` SET `active` = 0 WHERE `id` = $id AND owner_id = $user_id;");

  }else if($action == "active"){
    $update = mysqli_query($conn, "UPDATE `sheet` SET `active` = 1 WHERE `id` = $id AND owner_id = $user_id;");
    $data = $update;

  }else if($action == "rm"){
    $rm = mysqli_query($conn, "DELETE FROM `sheet` WHERE `id` = $id AND owner_id = $user_id;");
    if($rm){
      $rm = mysqli_query($conn, "DELETE FROM `line` WHERE `sheet_id` = $id;");
    }
    $data = $rm;

  }else{

    if($id == "NEW_SHEET"){
      $add = mysqli_query($conn, "INSERT INTO `sheet` (`id`, `owner_id`, `title`, `active`, `created_at`, `accessed_at`) VALUES (NULL, '$user_id', 'Untitled Sheet', 1, '$time', '$time')");
      $added = mysqli_query($conn, "SELECT id FROM `sheet` WHERE owner_id = $user_id Order by accessed_at desc LIMIT 1");
      $id = intval(mysqli_fetch_object($added)->id);
      $add_line = mysqli_query($conn, "INSERT INTO `line` (`id`, `sheet_id`, `line_key`, `date`, `text`, `pos`) VALUES (NULL, '$id', '".uniqid()."', '$formatted_time', '', '0')");
    }

    if($id == "LAST_ACCESSED"){
      $sheet = mysqli_query($conn, "SELECT * FROM `sheet` WHERE owner_id = $user_id Order by accessed_at desc LIMIT 1");
      $id = mysqli_fetch_array($sheet)[0];
      if(!$id){
        $add = mysqli_query($conn, "INSERT INTO `sheet` (`id`, `owner_id`, `title`, `active`, `created_at`, `accessed_at`) VALUES (NULL, '$user_id', 'Untitled Sheet', 1, '$time', '$time')");
        $added = mysqli_query($conn, "SELECT id FROM `sheet` WHERE owner_id = $user_id Order by accessed_at desc LIMIT 1");
        $id = intval(mysqli_fetch_object($added)->id);
        $add_line = mysqli_query($conn, "INSERT INTO `line` (`id`, `sheet_id`, `line_key`, `date`, `text`, `pos`) VALUES (NULL, '$id', '".uniqid()."', '$formatted_time', '', '0')");
      }
    }

    $sheet = mysqli_query($conn, "SELECT * FROM `sheet` WHERE `id` = $id AND owner_id = $user_id LIMIT 1");

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
    }
  }
}else{
  $data = "NO_AUTH";
}


header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization");
header('Content-Type: application/json');
echo json_encode($data);
?>
