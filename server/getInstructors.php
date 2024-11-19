<?php
include "connection.php";
require 'vendor/autoload.php';

$headers = getallheaders();

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$key = "mohammad";
$error = '';

if (isset($headers['Authorization'])) {
    $token = str_replace('Bearer ', '', $headers['Authorization']);

    try {
        // Decode the JWT token
        $decoded = JWT::decode($token, new Key($key, 'HS256'));

        $query = $connection->prepare("SELECT * FROM users WHERE role = 'instructor'");
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
            http_response_code(200); 
            echo json_encode([]);
        }
        
    } catch (Exception $e) {
        http_response_code(401); 
        echo json_encode(["error" => "Unauthorized: Invalid token"]);
    }
} else {
    http_response_code(400); 
    echo json_encode(["error" => "Authorization header missing"]);
}
?>
