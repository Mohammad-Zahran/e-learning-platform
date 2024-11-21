<?php
// getInvitedCourses.php

include "connection.php";  // Database connection
require 'vendor/autoload.php';  // Include Firebase JWT library

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$key = "mohammad";
$headers = getallheaders();

if (isset($headers['Authorization'])) {
    $token = str_replace('Bearer ', '', $headers['Authorization']);

    try {
        $decoded = JWT::decode($token, new Key($key, 'HS256'));

        // Check if the user role is 'student' (adjust role validation based on your system)
        if ($decoded->role !== 'student') {
            http_response_code(403);
            echo json_encode(["status" => "error", "message" => "Only students can access this endpoint."]);
            exit();
        }

        // Fetch invited courses for the student
        $student_id = $decoded->id;

        $stmt = $connection->prepare("SELECT c.id, c.name, c.description, c.created_at, c.updated_at 
                                      FROM courses c
                                      INNER JOIN course_invitations ci ON c.id = ci.course_id
                                      WHERE ci.student_id = ? AND ci.status = 'accepted'");
        $stmt->bind_param("i", $student_id);
        $stmt->execute();
        $result = $stmt->get_result();

        $courses = [];
        while ($row = $result->fetch_assoc()) {
            $courses[] = $row;
        }

        // If no courses found, return an empty array
        echo json_encode(["status" => "success", "data" => $courses]);

    } catch (Exception $e) {
        // Catch and handle any exceptions (e.g., invalid or expired token)
        http_response_code(401);
        echo json_encode(["status" => "error", "message" => "Invalid or expired token.", "error" => $e->getMessage()]);
    }

} else {
    // If Authorization header is missing, return an error
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Authorization header missing."]);
}
?>
