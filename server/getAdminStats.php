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

        if ($decoded->role !== 'admin') {
            http_response_code(403);
            echo json_encode(["error" => "Unauthorized"]);
            exit();
        }

        $stats = [
            "students" => $connection->query("SELECT COUNT(*) AS count FROM users WHERE role = 'student'")->fetch_assoc()['count'],
            "instructors" => $connection->query("SELECT COUNT(*) AS count FROM users WHERE role = 'instructor'")->fetch_assoc()['count'],
            "courses" => $connection->query("SELECT COUNT(*) AS count FROM courses")->fetch_assoc()['count'],
            "bannedStudents" => $connection->query("SELECT COUNT(*) AS count FROM users WHERE role = 'student' AND status = 'banned'")->fetch_assoc()['count'],
            "bannedInstructors" => $connection->query("SELECT COUNT(*) AS count FROM users WHERE role = 'instructor' AND status = 'banned'")->fetch_assoc()['count'],
        ];

        echo json_encode($stats);
    } catch (Exception $e) {
        http_response_code(401);
        echo json_encode(["error" => "Invalid or expired token"]);
    }
} else {
    http_response_code(400);
    echo json_encode(["error" => "Authorization header missing"]);
}
?>
