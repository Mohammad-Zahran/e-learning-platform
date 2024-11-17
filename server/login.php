<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET");

require 'vendor/autoload.php';
include 'connection.php';

use Firebase\JWT\JWT;

$key = "mohammad"; 
$error = '';

if (empty($_POST["email"])) {
    $error = 'Please Enter Email Details';
} elseif (empty($_POST["password"])) {
    $error = 'Please Enter Password Details';
} else {
    $email = $_POST["email"];
    $password = $_POST["password"];

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
                "iat" => time(),
                "exp" => time() + (60 * 60) // Token expires in 1 hour
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
?>
