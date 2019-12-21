<?php
ini_set('session.gc_maxlifetime', 2592000);
session_set_cookie_params(2592000);
ini_set('session.cookie_domain', '.usememo.com' );
session_start();
include("config.php");

$refresh = $_GET["refresh"];
$development = $_GET["development"];

$code = $_GET['code'];
$url = 'https://github.com/login/oauth/access_token';
$client_id = 'd63ed284bfb2c8e7a5d4';
$client_secret = 'f453188069f4f9d026076bffba4109da14243cea';
// echo $code;
$postdata = http_build_query(
    array(
        'client_id' => $client_id,
        'client_secret' => $client_secret,
        'code' => $code,
        'scope' => ['gist']
    )
);
$opts = array('http' =>
    array(
        'method'  => 'POST',
        'header'  => 'Content-type: application/x-www-form-urlencoded',
        'content' => $postdata
    )
);
$context = stream_context_create($opts);
$result = file_get_contents($url, false, $context);
$access_token = explode("&", explode("access_token=", $result)[1])[0];

$json_url = 'https://api.github.com/user?'.$result;
$options  = array('http' => array('user_agent'=> $_SERVER['HTTP_USER_AGENT']));
$context  = stream_context_create($options);
$response = file_get_contents($json_url, false, $context);
$response = json_decode($response);

$email = "";
$time = time();
$token = $response->node_id;
$name = $response->name;
$avatar = $response->avatar_url;

if($response->email){
  $email = $response->email;
}else{
  $email = $response->login ."@github.com";
}


//Enable the following to redirect to another page
// header('location:chat.php');


$user = mysqli_query($conn, "SELECT * FROM `user` WHERE `email` = '$email' LIMIT 1");
if(mysqli_num_rows($user)){
  $data = mysqli_fetch_object($user);
  $time = mysqli_query($conn, "UPDATE `user` SET `last_active` = '$time', `token` = '$access_token' WHERE `user`.`email` = '$email';");

  if(!$refresh){
    if($development){
      header("Location: http://localhost:3000/");
    }else{
      header("Location: https://app.usememo.com/");
    }
  }else{
    if($development){
      header("Location: http://localhost:3000/refresh/");
    }else{
      header("Location: https://app.usememo.com/refresh/");
    }
  }

  $_SESSION['user_id'] = intval($data->id);
}else{
  $add = mysqli_query($conn, "INSERT INTO `user` (`id`, `email`, `name`, `avatar`, `config`, `token`, `registered_at`, `last_active`) VALUES (NULL, '$email', '$name', '$avatar', '$config', '$access_token', '$time', '$time');");
  $user = mysqli_query($conn, "SELECT * FROM `user` WHERE `email` = '$email' LIMIT 1");
  $data = mysqli_fetch_object($user);
  $_SESSION['user_id'] = intval($data->id);

  if(!$refresh){
    if($development){
      header("Location: http://localhost:3000/");
    }else{
      header("Location: https://app.usememo.com/");
    }
  }else{
    if($development){
      header("Location: http://localhost:3000/refresh/");
    }else{
      header("Location: https://app.usememo.com/refresh/");
    }
  }
}


?>
