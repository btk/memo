<?php
include("config.php");
$id = $_GET["id"];
$svgName = $_GET["name"];
$svgQuery = mysqli_query($GLOBALS['connection'], "SELECT * FROM `svg` LIMIT 100");
$checkAvailability = mysqli_num_rows($svgQuery);

if($_GET["graphql"]){

  while($object = mysqli_fetch_object($svgQuery)) {
    $objects[]=$object;
  }




  header("Access-Control-Allow-Origin: *");
  header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
  header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization");
  header('Content-Type: application/json');
  echo json_encode($objects);

}

?>
