<?php
session_start();
require 'db_connection.php'; // $pdo

header('Content-Type: application/json');

try {
    $data = json_decode(file_get_contents('php://input'), true);
    $user_id = $data['user_id'] ?? null;
    $active = $data['active'] ?? null;

    if ($user_id === null || $active === null) {
        echo json_encode(['success' => false, 'message' => 'User ID or active status missing']);
        exit;
    }

    $stmt = $pdo->prepare("UPDATE user SET active = :active WHERE user_id = :user_id");
    $stmt->execute([
        'active' => $active,
        'user_id' => $user_id
    ]);

    echo json_encode(['success' => true, 'message' => 'User status updated successfully']);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
