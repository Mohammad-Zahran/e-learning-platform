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

        if (!isset($_GET['course_id'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Missing course_id parameter."]);
            exit();
        }

        $course_id = intval($_GET['course_id']);

        $stmt = $connection->prepare("
            SELECT 'announcement' AS type, id, title, content, created_at 
            FROM announcements 
            WHERE course_id = ? 
            UNION ALL 
            SELECT 'assignment' AS type, id, title, description AS content, created_at 
            FROM assignments 
            WHERE course_id = ?
            ORDER BY created_at DESC
        ");
        $stmt->bind_param("ii", $course_id, $course_id);
        $stmt->execute();
        $result = $stmt->get_result();

        $streamContent = [];
        while ($row = $result->fetch_assoc()) {
            $streamContent[] = $row;
        }

        echo json_encode(["status" => "success", "data" => $streamContent]);
    } catch (Exception $e) {
        http_response_code(401);
        echo json_encode(["status" => "error", "message" => "Invalid or expired token."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Authorization header missing."]);
}
?>
