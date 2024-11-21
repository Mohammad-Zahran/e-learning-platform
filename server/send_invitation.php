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
            echo json_encode(["status" => "error", "message" => "You do not have permission to send invitations."]);
            exit();
        }

        $input_data = json_decode(file_get_contents('php://input'), true);

        if (!isset($input_data['course_id']) || !isset($input_data['student_email'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Missing course_id or student_email parameter."]);
            exit();
        }

        $course_id = $input_data['course_id'];
        $student_email = $input_data['student_email'];

        $stmt = $connection->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->bind_param("s", $student_email);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows == 0) {
            http_response_code(404);
            echo json_encode(["status" => "error", "message" => "Student not found."]);
            exit();
        }

        $student = $result->fetch_assoc();
        $student_id = $student['id'];

        $stmt = $connection->prepare("SELECT * FROM enrollments WHERE course_id = ? AND student_id = ?");
        $stmt->bind_param("ii", $course_id, $student_id);
        $stmt->execute();
        $enrollment = $stmt->get_result();

        if ($enrollment->num_rows > 0) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Student is already enrolled in the course."]);
            exit();
        }

        $stmt = $connection->prepare("INSERT INTO course_invitations (course_id, student_id, status) VALUES (?, ?, 'pending')");
        $stmt->bind_param("ii", $course_id, $student_id);
        $stmt->execute();

        echo json_encode(["status" => "success", "message" => "Invitation sent successfully."]);

    } catch (Exception $e) {
        http_response_code(401);
        echo json_encode(["status" => "error", "message" => "Invalid or expired token."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Authorization header missing."]);
}
?>
