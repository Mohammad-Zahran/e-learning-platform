<?php
include "connection.php"; 
require 'vendor/autoload.php'; 

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$key = "mohammad"; 
$headers = getallheaders();

if (isset($headers['Authorization'])) {
    $token = str_replace('Bearer ', '', $headers['Authorization']);

    try {
        $decoded = JWT::decode($token, new Key($key, 'HS256'));

        if (!in_array($decoded->role, ['instructor', 'student', 'admin'])) {
            http_response_code(403);
            echo json_encode(["status" => "error", "message" => "You do not have permission to view this data."]);
            exit();
        }

        if (!isset($_GET['course_id'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Missing course_id parameter."]);
            exit();
        }

        $course_id = $_GET['course_id'];

        $stmt = $connection->prepare("
            SELECT i.id, i.name, i.email
            FROM users i
            JOIN course_instructors ci ON i.id = ci.instructor_id
            WHERE ci.course_id = ? AND i.role = 'instructor'
        ");
        $stmt->bind_param("i", $course_id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $instructor = $result->fetch_assoc();
            echo json_encode(["status" => "success", "instructor" => $instructor]);
        } else {
            http_response_code(404);
            echo json_encode(["status" => "error", "message" => "No instructor found for this course."]);
        }
    } catch (Exception $e) {
        http_response_code(401);
        echo json_encode(["status" => "error", "message" => "Invalid or expired token."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Authorization header missing."]);
}
?>
