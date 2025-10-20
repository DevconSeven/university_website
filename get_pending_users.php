<?php
session_start();
require 'db_connection.php'; // stellt $pdo bereit

header('Content-Type: application/json');

try {
    $stmt = $pdo->prepare("
        SELECT pending_id, username, role, created_at
        FROM pending_user
    ");
    $stmt->execute();
    $pendingUsers = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Optional: role_id hinzufügen für einfaches Matching in JS
    $roles = ["admin" => 1, "secretariat" => 2, "lecturer" => 3, "student" => 4];
    foreach ($pendingUsers as &$user) {
        $roleKey = strtolower(trim($user['role'])); // trim + lowercase
        $user['role_id'] = $roles[$roleKey] ?? 4;   // fallback Student
    }


    echo json_encode($pendingUsers);

} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>