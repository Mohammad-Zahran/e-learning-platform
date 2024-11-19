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

        if ($decoded->role !== 'admin') {
            http_response_code(403);
            echo json_encode(["status" => "error", "message" => "You do not have permission to assign a course."]);
            exit();
        }

        $data = json_decode(file_get_contents("php://input"), true);

        if (!isset($data['course_id']) || empty($data['course_id'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Course ID is required."]);
            exit();
        }

        if (!isset($data['instructor_id']) || empty($data['instructor_id'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Instructor ID is required."]);
            exit();
        }

        $course_id = $data['course_id'];
        $instructor_id = $data['instructor_id'];

        $checkStmt = $connection->prepare("SELECT * FROM course_instructors WHERE course_id = ? AND instructor_id = ?");
        $checkStmt->bind_param("ii", $course_id, $instructor_id);
        $checkStmt->execute();
        $result = $checkStmt->get_result();

        if ($result->num_rows > 0) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Course is already assigned to this instructor."]);
            exit();
        }

        $stmt = $connection->prepare("INSERT INTO course_instructors (course_id, instructor_id) VALUES (?, ?)");
        $stmt->bind_param("ii", $course_id, $instructor_id);

        if ($stmt->execute()) {
            http_response_code(200);
            echo json_encode(["status" => "success", "message" => "Course assigned to instructor successfully."]);
        } else {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Failed to assign course to instructor."]);
        }

        $stmt->close();
        $checkStmt->close();
    } catch (Exception $e) {
        http_response_code(401);
        echo json_encode(["status" => "error", "message" => "Invalid or expired token."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Authorization header missing"]);
}
?>
