<?php
header('Content-Type: application/json');
require_once 'db_connection.php'; // stellt $pdo bereit

// JSON auslesen
$data = json_decode(file_get_contents("php://input"), true);
$user = trim($data["username"] ?? "");
$pass = $data["password"] ?? "";

// Validierungen
if (!$user || !$pass) {
    echo json_encode(["success" => false, "message" => "Missing username or password."]);
    exit;
}

// Prüfen ob Username schon existiert (in user oder pending_user)
$sql = "SELECT username FROM user WHERE username = :username UNION SELECT username FROM pending_user WHERE username = :username";
$stmt = $pdo->prepare($sql);
$stmt->execute(['username' => $user]);
if ($stmt->rowCount() > 0) {
    echo json_encode(["success" => false, "message" => "Username already exists."]);
    exit;
}

// Passwort-Hash
$hashed = password_hash($pass, PASSWORD_DEFAULT);

// In pending_user einfügen
$sqlInsert = "INSERT INTO pending_user (username, password) VALUES (:username, :password)";
$stmtInsert = $pdo->prepare($sqlInsert);
$success = $stmtInsert->execute(['username' => $user, 'password' => $hashed]);

if ($success) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => "Database insert failed."]);
}
?>
