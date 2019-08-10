<?php
  error_reporting(0);
  $servername = "127.0.0.1";
  $username = "root";
  $password = "1";
  $dbname = "note";

  // Create connection
  $conn = new mysqli($servername, $username, $password, $dbname);
  $GLOBALS["connection"] = $conn;
  // Check connection
  if ($conn->connect_error) {
      die("Connection failed: " . $conn->connect_error);
  }
