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

        // Token expiration check
        if (isset($decoded->exp) && time() > $decoded->exp) {
            http_response_code(401);
            echo json_encode(["status" => "error", "message" => "Token has expired."]);
            exit();
        }

        if ($decoded->role !== 'admin' && $decoded->role !== 'instructor') {
            http_response_code(403);
            echo json_encode(["status" => "error", "message" => "You do not have permission to create an assignment."]);
            exit();
        }

        $data = json_decode(file_get_contents("php://input"), true);

        // Validate required fields
        if (!isset($data['title']) || empty($data['title'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Assignment title is required."]);
            exit();
        }

        if (!isset($data['description']) || empty($data['description'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Assignment description is required."]);
            exit();
        }

        if (!isset($data['due_date']) || empty($data['due_date'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Due date is required."]);
            exit();
        }

        if (!isset($data['course_id']) || empty($data['course_id'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Course ID is required."]);
            exit();
        }

        // Use the instructor_id from the decoded token
        $instructor_id = $decoded->id; // Assuming the instructor's ID is in the JWT payload

        $title = $data['title'];
        $description = $data['description'];
        $due_date = $data['due_date'];
        $course_id = $data['course_id'];

        // Updated query with instructor_id
        $stmt = $connection->prepare("INSERT INTO assignments (title, description, due_date, course_id, instructor_id, created_at) VALUES (?, ?, ?, ?, ?, NOW())");
        $stmt->bind_param("sssii", $title, $description, $due_date, $course_id, $instructor_id);

        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode(["status" => "success", "message" => "Assignment created successfully."]);
        } else {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Failed to create the assignment."]);
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
