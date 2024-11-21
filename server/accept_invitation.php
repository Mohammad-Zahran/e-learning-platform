<?php
// Include the database connection
include "connection.php";
require 'vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

// Define your JWT secret key
$key = "mohammad";

// Retrieve headers and check for the Authorization token
$headers = getallheaders();

if (!isset($headers['Authorization'])) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Authorization header missing."]);
    exit();
}

// Extract the token
$token = str_replace('Bearer ', '', $headers['Authorization']);

try {
    // Decode the token
    $decoded = JWT::decode($token, new Key($key, 'HS256'));

    // Verify if the user has the 'student' role
    if ($decoded->role !== 'student') {
        http_response_code(403);
        echo json_encode(["status" => "error", "message" => "You do not have permission to accept invitations."]);
        exit();
    }

    // Parse the request body to retrieve course_id
    $inputData = json_decode(file_get_contents('php://input'), true);

    if (!isset($inputData['course_id'])) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Missing course_id parameter."]);
        exit();
    }

    $course_id = $inputData['course_id'];
    $student_id = $decoded->id;

    // Check if the invitation exists for the given course_id and student_id
    $stmt = $connection->prepare("SELECT * FROM course_invitations WHERE course_id = ? AND student_id = ?");
    $stmt->bind_param("ii", $course_id, $student_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        http_response_code(404);
        echo json_encode(["status" => "error", "message" => "Invitation not found for this course."]);
        exit();
    }

    // Fetch the invitation data
    $invitation_data = $result->fetch_assoc();

    // Ensure the invitation is still in a pending state
    if ($invitation_data['status'] !== 'pending') {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Invitation is not in a pending state."]);
        exit();
    }

    // Update the status of the course_invitation to 'accepted'
    $update_stmt = $connection->prepare("UPDATE course_invitations SET status = 'accepted', accepted_at = NOW() WHERE course_id = ? AND student_id = ?");
    $update_stmt->bind_param("ii", $course_id, $student_id);

    if ($update_stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Invitation accepted successfully."]);
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Failed to update the invitation status."]);
    }

} catch (Exception $e) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Invalid or expired token."]);
    exit();
}
?>
