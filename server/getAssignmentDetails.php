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

        if ($decoded->role !== 'instructor' && $decoded->role !== 'admin') {
            http_response_code(403);
            echo json_encode(["error" => "Unauthorized"]);
            exit();
        }

        if (!isset($_GET['assignment_id']) || empty($_GET['assignment_id'])) {
            http_response_code(400);
            echo json_encode(["error" => "Missing or invalid assignment_id"]);
            exit();
        }

        $assignment_id = intval($_GET['assignment_id']);

        $query = $connection->prepare("
            SELECT a.id, a.title, a.description, a.due_date, a.course_id
            FROM assignments a
            WHERE a.id = ?
        ");
        $query->bind_param("i", $assignment_id);
        $query->execute();
        $result = $query->get_result();

        if ($result->num_rows === 0) {
            http_response_code(404);
            echo json_encode(["error" => "Assignment not found"]);
            exit();
        }

        $assignment = $result->fetch_assoc();
        echo json_encode($assignment);

    } catch (Exception $e) {
        http_response_code(401);
        echo json_encode(["error" => "Invalid or expired token"]);
    }
} else {
    http_response_code(400);
    echo json_encode(["error" => "Authorization header missing"]);
}
?>
