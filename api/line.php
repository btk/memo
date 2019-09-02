<?php
session_id($_POST["session_id"]);
session_start();
include("config.php");

$user_id = $_SESSION['user_id'];

if($user_id){

  $id = $_POST["id"];
  $date = explode("!", explode("-", $id)[0])[1];
  $key = explode("-", $id)[1];
  $sheetId = explode("!", explode("-", $id)[0])[0];
  $sheetAuth = mysqli_query($conn, "SELECT id FROM `sheet` WHERE `owner_id` = '$user_id' AND `id` = '$sheetId' LIMIT 1");
  if(!mysqli_num_rows($sheetAuth)){
    die();
  }

  $pos = $_POST["pos"];
  $text = addslashes($_POST["text"]);
  $action = $_POST["action"];
  $hint = $_POST["hint"];

  if($action == "rm"){
    $remove = mysqli_query($conn, "DELETE FROM `line` WHERE `date` = '$date' AND `sheet_id` = '$sheetId' AND `pos` = '$pos';");
    $bumpDown = mysqli_query($conn, "UPDATE `line` SET pos = pos-1 WHERE `pos` >= $pos AND sheet_id = $sheetId;");
    $data = $remove;
  }else{
    if($action == "key"){
      $checkKey = $hint;
      $updateKey = ", line_key='$key'";
    }else{
      $checkKey = $key;
      $updateKey = "";
    }

    $line = mysqli_query($conn, "SELECT id FROM `line` WHERE `date` = '$date' AND `sheet_id` = '$sheetId' AND `pos` = '$pos' AND `line_key` = '$checkKey' LIMIT 1");
    if(mysqli_num_rows($line)){
      $lineId = mysqli_fetch_object($line)->id;
      $update = mysqli_query($conn, "UPDATE `line` SET `text` = '$text'$updateKey WHERE `id` = $lineId;");
      $data = $update;
    }else{
      $bumpUp = mysqli_query($conn, "UPDATE `line` SET pos = pos+1 WHERE `pos` >= $pos AND sheet_id = $sheetId;");
      $add = mysqli_query($conn, "INSERT INTO `line` (`id`, `sheet_id`, `line_key`, `date`, `text`, `pos`) VALUES (NULL, '$sheetId', '$key', '$date', '$text', '$pos')");
      $data = $add;
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
