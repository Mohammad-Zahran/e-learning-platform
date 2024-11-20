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

        if (isset($decoded->exp) && time() > $decoded->exp) {
            http_response_code(401);
            echo json_encode(["status" => "error", "message" => "Token has expired."]);
            exit();
        }

        if ($decoded->role !== 'admin' && $decoded->role !== 'instructor') {
            http_response_code(403);
            echo json_encode(["status" => "error", "message" => "You do not have permission to update an assignment."]);
            exit();
        }

        $data = json_decode(file_get_contents("php://input"), true);

        if (!isset($data['assignment_id']) || empty($data['assignment_id'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Assignment ID is required."]);
            exit();
        }

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

        $assignment_id = $data['assignment_id'];
        $title = $data['title'];
        $description = isset($data['description']) ? $data['description'] : '';
        $due_date = $data['due_date'];

        $stmt = $connection->prepare("UPDATE assignments SET title = ?, description = ?, due_date = ?, updated_at = NOW() WHERE id = ?");
        $stmt->bind_param("sssi", $title, $description, $due_date, $assignment_id);

        if ($stmt->execute()) {
            if ($stmt->affected_rows > 0) {
                http_response_code(200);
                echo json_encode(["status" => "success", "message" => "Assignment updated successfully."]);
            } else {
                http_response_code(404);
                echo json_encode(["status" => "error", "message" => "Assignment not found or no changes were made."]);
            }
        } else {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Failed to update the assignment."]);
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
