<?php
session_start();
require 'db_connection.php'; // $pdo

header('Content-Type: application/json');

try {
    $data = json_decode(file_get_contents('php://input'), true);
    $username = $data['username'] ?? null;
    $role_id = $data['role_id'] ?? null;

    if (!$username) {
        echo json_encode(['success' => false, 'message' => 'Username missing']);
        exit;
    }

    // --- Pending User abfragen ---
    $stmt = $pdo->prepare("SELECT password, role_id FROM pending_user WHERE username = :username");
    $stmt->execute(['username' => $username]);
    $pendingUser = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$pendingUser) {
        echo json_encode(['success' => false, 'message' => 'Pending user not found']);
        exit;
    }

    // --- Rolle aus Dropdown oder DB nehmen ---
    $roleToUse = $role_id ?? $pendingUser['role_id'];

    // --- In "user" Tabelle einfügen ---
    $stmt = $pdo->prepare("
        INSERT INTO user (username, password, role_id, active)
        VALUES (:username, :password, :role_id, 1)
    ");
    $stmt->execute([
        'username' => $username,
        'password' => $pendingUser['password'],
        'role_id'  => $roleToUse
    ]);

    // --- Pending User löschen ---
    $stmt = $pdo->prepare("DELETE FROM pending_user WHERE username = :username");
    $stmt->execute(['username' => $username]);

    echo json_encode(['success' => true, 'message' => 'User approved successfully']);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
