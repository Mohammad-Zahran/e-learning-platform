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
            echo json_encode(["status" => "error", "message" => "Only students can access this endpoint."]);
            exit();
        }

        $student_id = $decoded->id;

        $stmt = $connection->prepare("SELECT c.id, c.name, c.description, c.created_at, c.updated_at, ci.status
                                      FROM courses c
                                      INNER JOIN course_invitations ci ON c.id = ci.course_id
                                      WHERE ci.student_id = ? AND (ci.status = 'accepted' OR ci.status = 'pending')");
        $stmt->bind_param("i", $student_id);
        $stmt->execute();
        $result = $stmt->get_result();

        $courses = [];
        while ($row = $result->fetch_assoc()) {
            $courses[] = $row;
        }

        echo json_encode(["status" => "success", "data" => $courses]);

    } catch (Exception $e) {
        http_response_code(401);
        echo json_encode(["status" => "error", "message" => "Invalid or expired token.", "error" => $e->getMessage()]);
    }

} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Authorization header missing."]);
}
?>
