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

        if ($decoded->role !== 'instructor') {
            http_response_code(403);
            echo json_encode(["error" => "Unauthorized"]);
            exit();
        }

        if (!isset($_GET['course_id']) || empty($_GET['course_id'])) {
            http_response_code(400);
            echo json_encode(["error" => "Missing or invalid course_id"]);
            exit();
        }

        $course_id = intval($_GET['course_id']); 
        $instructor_id = $decoded->id; 

        $query = $connection->prepare("
            SELECT c.id, c.name, c.description, c.created_at, c.updated_at
            FROM courses c
            JOIN course_instructors ci ON c.id = ci.course_id
            WHERE c.id = ? AND ci.instructor_id = ?
        ");
        $query->bind_param("ii", $course_id, $instructor_id);
        $query->execute();
        $result = $query->get_result();

        if ($result->num_rows === 0) {
            http_response_code(404);
            echo json_encode(["error" => "Course not found or access denied"]);
            exit();
        }

        $course = $result->fetch_assoc();

        echo json_encode($course);

    } catch (Exception $e) {
        http_response_code(401);
        echo json_encode(["error" => "Invalid or expired token"]);
    }
} else {
    http_response_code(400);
    echo json_encode(["error" => "Authorization header missing"]);
}
?>
