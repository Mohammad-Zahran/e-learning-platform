<?php
include "connection.php";
require 'vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$key = "mohammad";

// Get all headers
$headers = getallheaders();

if (isset($headers['Authorization'])) {
    $token = str_replace('Bearer ', '', $headers['Authorization']);

    try {
        $decoded = JWT::decode($token, new Key($key, 'HS256'));

        if ($decoded->role !== 'admin') {
            http_response_code(403);
            echo json_encode(["status" => "error", "message" => "You do not have permission to delete a course."]);
            exit();
        }

        $data = json_decode(file_get_contents("php://input"), true);

        if (!isset($data['course_id']) || empty($data['course_id'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Course ID is required."]);
            exit();
        }

        $course_id = $data['course_id'];

        // Prepare SQL query to delete the course
        $stmt = $connection->prepare("DELETE FROM courses WHERE id = ?");
        $stmt->bind_param("i", $course_id);

        if ($stmt->execute()) {
            if ($stmt->affected_rows > 0) {
                http_response_code(200);
                echo json_encode(["status" => "success", "message" => "Course deleted successfully."]);
            } else {
                http_response_code(404);
                echo json_encode(["status" => "error", "message" => "Course not found."]);
            }
        } else {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Failed to delete the course."]);
        }

        $stmt->close();
    } catch (Exception $e) {
        http_response_code(401); 
        echo json_encode(["status" => "error", "message" => "Invalid or expired token."]);
    }
} else {
    http_response_code(400); 
    echo json_encode(["status" => "error", "message" => "Authorization header missing"]);
}
?>
