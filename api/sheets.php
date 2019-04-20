<?php
include("config.php");

$id = $_POST["id"];
$active = $_POST["active"];

$sheet = mysqli_query($conn, "SELECT sheet.*,
    (SELECT COUNT(*) from line WHERE sheet_id = sheet.id) as line_count,
    (SELECT text from line WHERE sheet_id = sheet.id order by pos asc limit 1) as first_line
    FROM `sheet` WHERE `owner_id` = '$id' AND `active` = $active order by accessed_at desc");
if(mysqli_num_rows($sheet)){
  $sheetArray = array();
  while($sheetObj = mysqli_fetch_object($sheet)){
    array_push($sheetArray, $sheetObj);
  }
  $data = $sheetArray;

}else{
  $data = false;
}

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization");
header('Content-Type: application/json');
echo json_encode($data);
?>
