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
            echo json_encode(["status" => "error", "message" => "You do not have permission to view courses."]);
            exit();
        }

        $stmt = $connection->prepare("
            SELECT c.id, c.name, c.description, GROUP_CONCAT(u.id, ':', u.name) AS instructors
            FROM courses c
            LEFT JOIN course_instructors ci ON c.id = ci.course_id
            LEFT JOIN users u ON ci.instructor_id = u.id
            GROUP BY c.id
        ");
        $stmt->execute();
        $result = $stmt->get_result();

        $courses = [];
        while ($row = $result->fetch_assoc()) {
            $row['assignedInstructors'] = [];
            if (!empty($row['instructors'])) {
                foreach (explode(',', $row['instructors']) as $instructor) {
                    list($id, $name) = explode(':', $instructor);
                    $row['assignedInstructors'][] = ['id' => $id, 'name' => $name];
                }
            }
            unset($row['instructors']);
            $courses[] = $row;
        }

        echo json_encode($courses);
    } catch (Exception $e) {
        http_response_code(401);
        echo json_encode(["status" => "error", "message" => "Invalid or expired token."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Authorization header missing"]);
}
?>
