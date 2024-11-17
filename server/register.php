<?php
require_once 'connection.php'; 
require_once 'vendor/autoload.php'; 

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

header("Content-Type: application/json");

$secret_key = "mohammad";

$data = json_decode(file_get_contents("php://input"), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
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
    $stmt = $connection->prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'student')");
    $stmt->bind_param("sss", $name, $email, $hashedPassword);

    if ($stmt->execute()) {
        $user_id = $stmt->insert_id;
        $payload = [
            "id" => $user_id,
            "email" => $email,
            "role" => "student",
            "iat" => time(),
            "exp" => time() + (60 * 60) 
        ];

        $jwt = JWT::encode($payload, $secret_key, 'HS256');

        echo json_encode([
            "status" => "success",
            "message" => "User registered successfully",
            "token" => $jwt
        ]);
    } else {
        echo json_encode(["status" => "error", "message" => "Registration failed"]);
    }
}
?>
