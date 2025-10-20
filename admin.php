<?php
// admin.php
header('Content-Type: application/json');

$host = 'localhost';
$dbname = 'uni';
$user = 'root';
$pass = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Datenbankverbindung fehlgeschlagen']);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$action = $data['action'] ?? '';

// Aktionen
if ($action === 'get_users') {
    $stmt = $pdo->query("
        SELECT u.user_id, u.username, r.role_name, u.active
        FROM user u
        JOIN roles r ON u.role_id = r.role_id
    ");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['success' => true, 'users' => $users]);

} elseif ($action === 'toggle_active') {
    $userId = $data['user_id'];
    $active = $data['active'] ? 1 : 0;

    $stmt = $pdo->prepare("UPDATE user SET active = ? WHERE user_id = ?");
    $stmt->execute([$active, $userId]);

    echo json_encode(['success' => true, 'message' => 'User status updated']);

} elseif ($action === 'reset_password') {
    $userId = $data['user_id'];
    $newPassword = password_hash('default123', PASSWORD_DEFAULT);

    $stmt = $pdo->prepare("UPDATE user SET password = ? WHERE user_id = ?");
    $stmt->execute([$newPassword, $userId]);

    echo json_encode(['success' => true, 'message' => 'Password reset to default123']);

} else {
    echo json_encode(['success' => false, 'message' => 'Invalid action']);
}
