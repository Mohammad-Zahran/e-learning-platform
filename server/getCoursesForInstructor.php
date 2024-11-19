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
            echo json_encode(["error" => "Unauthorized"]);
            exit();
        }

        $instructor_id = $decoded->id; 
        $query = $connection->prepare("
            SELECT c.id, c.name, c.description, c.created_at, c.updated_at
            FROM courses c
            JOIN course_instructors ci ON c.id = ci.course_id
            WHERE ci.instructor_id = ?
        ");
        $query->bind_param("i", $instructor_id);
        $query->execute();
        $result = $query->get_result();

        $courses = [];
        while ($row = $result->fetch_assoc()) {
            $courses[] = $row;
        }

        echo json_encode($courses);
    } catch (Exception $e) {
        http_response_code(401);
        echo json_encode(["error" => "Invalid or expired token"]);
    }
} else {
    http_response_code(400);
    echo json_encode(["error" => "Authorization header missing"]);
}
?>
