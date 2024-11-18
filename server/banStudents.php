<?php

include "connection.php";
require 'vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$key = "mohammad";

// Get all headers
$headers = getallheaders();

// Check if the Authorization header exists
if (isset($headers['Authorization'])) {
    // Extract the token from the Authorization header
    $token = str_replace('Bearer ', '', $headers['Authorization']);

    try {
        // Decode the JWT token
        $decoded = JWT::decode($token, new Key($key, 'HS256'));

        // This if statement will check if the role of the user is an admin in order to update the banned of the student
        if ($decoded->role !== 'admin') {
            http_response_code(403);
            echo json_encode(["error" => "Access denied"]);
            exit;
        }

        // Get the student ID and ban status
        $data = json_decode(file_get_contents("php://input"), true);
        $studentId = $data["id"];
        $isBanned = $data["is_banned"];

        // Update the banned status
        $query = $connection->prepare("UPDATE users SET is_banned = ? WHERE id = ?");
        $query->bind_param("ii", $isBanned, $studentId);
        $query->execute();

        if ($query->affected_rows > 0) {
            echo json_encode(["message" => "Student updated successfully"]);
        } else {
            echo json_encode(["error" => "Failed to update student"]);
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
