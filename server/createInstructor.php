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
            echo json_encode(["status" => "error", "message" => "Unauthorized: Only admins can create instructors"]);
            exit();
        }
    } catch (Exception $e) {
        echo json_encode(["status" => "error", "message" => "Invalid token"]);
        exit();
    }

    $name = $data['name'] ?? '';
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';

    if (empty($name) || empty($email) || empty($password)) {
        echo json_encode(["status" => "error", "message" => "All fields are required"]);
        exit();
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(["status" => "error", "message" => "Invalid email format"]);
        exit();
    }

    if (strlen($password) < 6) {
        echo json_encode(["status" => "error", "message" => "Password must be at least 6 characters"]);
        exit();
    }

    $stmt = $connection->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        echo json_encode(["status" => "error", "message" => "Email already exists"]);
        exit();
    }

    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    $stmt = $connection->prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'instructor')");
    $stmt->bind_param("sss", $name, $email, $hashedPassword);

    if ($stmt->execute()) {
        echo json_encode([
            "status" => "success",
            "message" => "Instructor created successfully"
        ]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to create instructor"]);
    }

    $stmt->close();
    $connection->close();
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request method"]);
}
?>
