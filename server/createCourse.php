<?php
require_once 'connection.php'; 
require_once 'vendor/autoload.php'; 

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

header("Content-Type: application/json");

$secret_key = "mohammad";

$data = json_decode(file_get_contents("php://input"), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $headers = getallheaders();
    if (!isset($headers['Authorization'])) {
        echo json_encode(["status" => "error", "message" => "Authorization header missing"]);
        exit();
    }

    $authHeader = $headers['Authorization'];
    $token = str_replace('Bearer ', '', $authHeader);

    try {
        $decoded = JWT::decode($token, new Key($secret_key, 'HS256'));
        $user = (array) $decoded;

        if ($user['role'] !== 'admin') {
            echo json_encode(["status" => "error", "message" => "Unauthorized: Only admins can create courses"]);
            exit();
        }
    } catch (Exception $e) {
        echo json_encode(["status" => "error", "message" => "Invalid token"]);
        exit();
    }

    $name = $data['name'] ?? '';
    $description = $data['description'] ?? '';

    if (empty($name) || empty($description) ) {
        echo json_encode(["status" => "error", "message" => "All fields are required"]);
        exit();
    }


    $stmt = $connection->prepare("SELECT id FROM courses WHERE name = ?");
    $stmt->bind_param("s", $name);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        echo json_encode(["status" => "error", "message" => "Course Already Exist"]);
        exit();
    }


    $stmt = $connection->prepare("INSERT INTO courses (name, description) VALUES (?, ?)");
    $stmt->bind_param("ss", $name, $description);

    if ($stmt->execute()) {
        echo json_encode([
            "status" => "success",
            "message" => "Course created successfully"
        ]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to create course"]);
    }

    $stmt->close();
    $connection->close();
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request method"]);
}
?>
