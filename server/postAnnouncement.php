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
            echo json_encode(["status" => "error", "message" => "Only instructors can post announcements."]);
            exit();
        }

        $input_data = json_decode(file_get_contents('php://input'), true);

        if (!isset($input_data['course_id']) || !isset($input_data['title']) || !isset($input_data['content'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Missing required parameters."]);
            exit();
        }

        $course_id = intval($input_data['course_id']);
        $title = $input_data['title'];
        $content = $input_data['content'];
        $instructor_id = $decoded->id;

        $stmt = $connection->prepare("SELECT * FROM course_instructors WHERE course_id = ? AND instructor_id = ?");
        $stmt->bind_param("ii", $course_id, $instructor_id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 0) {
            http_response_code(403);
            echo json_encode(["status" => "error", "message" => "You are not assigned to this course."]);
            exit();
        }

        $stmt = $connection->prepare("INSERT INTO announcements (course_id, user_id, title, content, created_at) VALUES (?, ?, ?, ?, NOW())");
        $stmt->bind_param("iiss", $course_id, $instructor_id, $title, $content);
        $stmt->execute();

        echo json_encode(["status" => "success", "message" => "Announcement posted successfully."]);
    } catch (Exception $e) {
        http_response_code(401);
        echo json_encode(["status" => "error", "message" => "Invalid or expired token.", "error" => $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Authorization header missing."]);
}
?>
