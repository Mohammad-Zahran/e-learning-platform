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
            echo json_encode(["status" => "error", "message" => "You do not have permission to view accepted students."]);
            exit();
        }

        $inputData = json_decode(file_get_contents('php://input'), true);

        if (!isset($inputData['course_id'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Missing course_id parameter."]);
            exit();
        }

        $course_id = $inputData['course_id'];

        // Query to get accepted students
        $stmt = $connection->prepare("
            SELECT u.id, u.name, u.email 
            FROM users u
            JOIN course_invitations ci ON u.id = ci.student_id
            WHERE ci.course_id = ? AND ci.status = 'accepted'
        ");
        $stmt->bind_param("i", $course_id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows == 0) {
            http_response_code(404);
            echo json_encode(["status" => "error", "message" => "No students found for this course."]);
            exit();
        }

        $students = [];
        while ($row = $result->fetch_assoc()) {
            $students[] = $row;
        }

        echo json_encode(["status" => "success", "students" => $students]);

    } catch (Exception $e) {
        http_response_code(401);
        echo json_encode(["status" => "error", "message" => "Invalid or expired token."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Authorization header missing."]);
}
?>
