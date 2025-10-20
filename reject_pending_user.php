<?php
header('Content-Type: application/json');
include 'db_connection.php';

$data = json_decode(file_get_contents('php://input'), true);
$username = $data['username'] ?? '';

if (!$username) {
    echo json_encode(['success' => false, 'message' => 'Username missing']);
    exit;
}

$stmt = $pdo->prepare("DELETE FROM pending_user WHERE username = :username");
$success = $stmt->execute(['username' => $username]);

if ($success) {
    echo json_encode(['success' => true, 'message' => 'User rejected and deleted']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error deleting pending user']);
}
?>
