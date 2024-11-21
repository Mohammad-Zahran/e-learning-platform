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

        if ($decoded->role !== 'student') {
            http_response_code(403);
            echo json_encode(["status" => "error", "message" => "You do not have permission to accept invitations."]);
            exit();
        }

        $inputData = json_decode(file_get_contents('php://input'), true);

        if (!isset($inputData['invitation_id'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Missing invitation_id parameter."]);
            exit();
        }

        $invitation_id = $inputData['invitation_id'];
        $student_id = $decoded->id; 

        $stmt = $connection->prepare("SELECT * FROM course_invitations WHERE id = ? AND student_id = ?");
        $stmt->bind_param("ii", $invitation_id, $student_id);
        $stmt->execute();
        $invitation = $stmt->get_result();

        if ($invitation->num_rows == 0) {
            http_response_code(404);
            echo json_encode(["status" => "error", "message" => "Invitation not found."]);
            exit();
        }

        $invitation_data = $invitation->fetch_assoc();
        $course_id = $invitation_data['course_id'];

        $stmt = $connection->prepare("SELECT * FROM enrollments WHERE course_id = ? AND student_id = ?");
        $stmt->bind_param("ii", $course_id, $student_id);
        $stmt->execute();
        $enrollment = $stmt->get_result();

        if ($enrollment->num_rows > 0) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Student is already enrolled."]);
            exit();
        }

        $stmt = $connection->prepare("INSERT INTO enrollments (course_id, student_id) VALUES (?, ?)");
        $stmt->bind_param("ii", $course_id, $student_id);
        $stmt->execute();

        $stmt = $connection->prepare("UPDATE course_invitations SET status = 'accepted' WHERE id = ?");
        $stmt->bind_param("i", $invitation_id);
        $stmt->execute();

        echo json_encode(["status" => "success", "message" => "Student enrolled successfully."]);

    } catch (Exception $e) {
        http_response_code(401);
        echo json_encode(["status" => "error", "message" => "Invalid or expired token."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Authorization header missing."]);
}
?>
