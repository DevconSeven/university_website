<?php
/**
 * login.php
 * ---------
 * Verarbeitet Benutzer-Logins:
 *  - prüft Benutzername, Passwort und Rolle
 *  - setzt bei Erfolg eine Session
 *  - gibt JSON-Antwort für das Frontend zurück
 */
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'domain' => 'localhost',
    'secure' => false,   // true wenn HTTPS
    'httponly' => true,
    'samesite' => 'Lax'  // oder 'None' bei cross-site
]);
session_start();
require 'db_connection.php'; // Stellt $pdo bereit

// --- JSON-Eingabe lesen ---
$input = json_decode(file_get_contents("php://input"), true);

// --- Eingabe prüfen ---
if (!isset($input['username'], $input['password'], $input['role'])) {
    echo json_encode(["success" => false, "message" => "Invalid input"]);
    exit;
}

$username = trim($input['username']);
$password = trim($input['password']);
$role     = trim($input['role']);

try {
    // --- Benutzer anhand des Usernames abfragen ---
    $stmt = $pdo->prepare("
        SELECT u.password, r.role_name
        FROM user u
        JOIN roles r ON u.role_id = r.role_id
        WHERE u.username = :username
    ");
    $stmt->execute(['username' => $username]);
    $user = $stmt->fetch();

    if (!$user) {
        echo json_encode(["success" => false, "message" => "User not found"]);
        exit;
    }

    // --- Passwort prüfen ---
    // Hinweis: Später bitte unbedingt Hashing mit password_hash() und password_verify() verwenden
    if ($password !== $user['password']) {
        echo json_encode(["success" => false, "message" => "Incorrect password"]);
        exit;
    }

    // --- Rollenvergleich (case-insensitive) ---
    if (strtolower($user['role_name']) !== strtolower($role)) {
        echo json_encode(["success" => false, "message" => "Role does not match"]);
        exit;
    }

    // --- Login erfolgreich → Session setzen ---
    $_SESSION['username'] = $username;
    $_SESSION['role'] = $user['role_name'];

    echo json_encode([
        "success" => true,
        "role" => $user['role_name'],
        "message" => "Login successful"
    ]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Query failed: " . $e->getMessage()]);
    exit;
}
?>
