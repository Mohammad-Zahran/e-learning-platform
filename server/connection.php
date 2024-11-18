<?php

header("Access-Control-Allow-Origin: *"); // Or specify a domain like 'http://localhost:5174'
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

$host = "localhost";
$dbuser = "root";
$pass = "";
$dbname = "elearningdb";

$connection = new mysqli($host, $dbuser, $pass, $dbname);

if ($connection->connect_error){
  die("Error happened");
}

