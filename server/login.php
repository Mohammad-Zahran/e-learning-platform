<?php

require 'vendor/autoload.php';
include 'connection.php';

use Firebase\JWT\JWT;

$key = "mohammad";
$error = '';

$data = json_decode(file_get_contents("php://input"), true);

if (empty($data["email"])) {
    $error = 'Please Enter Email Details';
} elseif (empty($data["password"])) {
    $error = 'Please Enter Password Details';
} else {
    $email = $data["email"];
    $password = $data["password"];

    $query = "SELECT * FROM users WHERE email = ?";
    $statement = $connection->prepare($query);
    $statement->bind_param("s", $email);
    $statement->execute();
    $result = $statement->get_result();
    $user = $result->fetch_assoc();

    if ($user) {
        if (password_verify($password, $user['password'])) {
            $payload = [
                "id" => $user['id'],
                "email" => $user['email'],
                "role" => $user['role'],
                "name" => $user['name'], 
                "iat" => time(),
                "exp" => time() + (60 * 60) 
            ];

            $jwt = JWT::encode($payload, $key, 'HS256');
            echo json_encode(["token" => $jwt]);
        } else {
            echo json_encode(["error" => "Invalid password"]);
        }
    } else {
        echo json_encode(["error" => "No user found with this email"]);
    }
}

if (!empty($error)) {
    echo json_encode(["error" => $error]);
}
