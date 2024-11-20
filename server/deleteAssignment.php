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
            echo json_encode(["status" => "error", "message" => "You do not have permission to delete an assignment."]);
            exit();
        }

        $data = json_decode(file_get_contents("php://input"), true);

        if (!isset($data['assignment_id']) || empty($data['assignment_id'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Assignment ID is required."]);
            exit();
        }

        $assignment_id = $data['assignment_id'];

        $stmt = $connection->prepare("DELETE FROM assignments WHERE id = ?");
        $stmt->bind_param("i", $assignment_id);

        if ($stmt->execute()) {
            if ($stmt->affected_rows > 0) {
                http_response_code(200);
                echo json_encode(["status" => "success", "message" => "Assignment deleted successfully."]);
            } else {
                http_response_code(404);
                echo json_encode(["status" => "error", "message" => "Assignment not found."]);
            }
        } else {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Failed to delete the assignment."]);
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
