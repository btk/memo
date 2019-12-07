<?php
  error_reporting(1);
  ini_set('session.cookie_domain', '.usememo.com' );
  $servername = "127.0.0.1";
  $username = "root";
  $password = "147896325Asd";
  $dbname = "memo";

  // Create connection
  $conn = new mysqli($servername, $username, $password, $dbname);
  $GLOBALS["connection"] = $conn;
  // Check connection
  if ($conn->connect_error) {
      die("Connection failed: " . $conn->connect_error);
  }
