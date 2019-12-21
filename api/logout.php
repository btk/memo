<?php
ini_set('session.gc_maxlifetime', 2592000);
session_set_cookie_params(2592000);
ini_set('session.cookie_domain', '.usememo.com' );
session_start();

$type = $_GET["type"];

$data = true;
$_SESSION = array();

setcookie(session_name(), '', 100);
session_unset();
session_destroy();

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
