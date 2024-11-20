<?php
include "connection.php"; 
require 'vendor/autoload.php'; 

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$key = "mohammad";  

// Get the headers to check the Authorization token
$headers = getallheaders();

if (isset($headers['Authorization'])) {
    // Extract the token from the Authorization header
    $token = str_replace('Bearer ', '', $headers['Authorization']);

    try {
        // Decode the JWT token
        $decoded = JWT::decode($token, new Key($key, 'HS256'));

        // Check if token has expired
        if (isset($decoded->exp) && time() > $decoded->exp) {
            http_response_code(401);
            echo json_encode(["status" => "error", "message" => "Token has expired."]);
            exit();
        }

        // Check user role for permission
        if ($decoded->role !== 'admin' && $decoded->role !== 'instructor') {
            http_response_code(403);
            echo json_encode(["status" => "error", "message" => "You do not have permission to update an assignment."]);
            exit();
        }

        // Get the data from the request body (JSON)
        $data = json_decode(file_get_contents("php://input"), true);

        // Validate required fields
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

        // Assign the input values to variables
        $assignment_id = $data['assignment_id'];
        $title = $data['title'];
        $description = isset($data['description']) ? $data['description'] : '';
        $due_date = $data['due_date'];

        // Prepare the SQL query to update the assignment
        $stmt = $connection->prepare("UPDATE assignments SET title = ?, description = ?, due_date = ?, updated_at = NOW() WHERE id = ?");
        $stmt->bind_param("sssi", $title, $description, $due_date, $assignment_id);

        // Execute the query
        if ($stmt->execute()) {
            if ($stmt->affected_rows > 0) {
                // Successfully updated
                http_response_code(200);
                echo json_encode(["status" => "success", "message" => "Assignment updated successfully."]);
            } else {
                // No rows were affected, meaning assignment not found or no changes made
                http_response_code(404);
                echo json_encode(["status" => "error", "message" => "Assignment not found or no changes were made."]);
            }
        } else {
            // SQL execution failed
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Failed to update the assignment."]);
        }

        // Close the statement
        $stmt->close();
    } catch (Exception $e) {
        // Invalid token or other error
        http_response_code(401);
        echo json_encode(["status" => "error", "message" => "Invalid or expired token."]);
    }
} else {
    // Authorization header missing
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Authorization header missing"]);
}
?>
