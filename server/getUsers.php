<?php

include "connection.php";
require 'vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$key = "mohammad";
$error = '';

// Get all headers
$headers = getallheaders();

// Check if the Authorization header exists
if (isset($headers['Authorization'])) {
    // Extract the token from the Authorization header
    $token = str_replace('Bearer ', '', $headers['Authorization']);

    try {
        // Decode the JWT token
        $decoded = JWT::decode($token, new Key($key, 'HS256'));

        $query = $connection->prepare("SELECT * FROM users");
        $query->execute();
        $result = $query->get_result();

        if ($result->num_rows > 0) {
            $array = [];
            while ($resultObject = $result->fetch_assoc()) {
                $array[] = $resultObject;
            }
            http_response_code(200);
            echo json_encode($array);
        } else {
            http_response_code(404); 
            echo json_encode(["message" => "No users found"]);
        }
    } catch (Exception $e) {
        http_response_code(401); 
        echo json_encode(["error" => "Unauthorized: Invalid token"]);
    }
} else {
    http_response_code(400); // Bad Request
    echo json_encode(["error" => "Authorization header missing"]);
}

?>
