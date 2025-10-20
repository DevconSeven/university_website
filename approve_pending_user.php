<?php
header('Content-Type: application/json');
include 'db_connection.php'; // stellt $pdo bereit

// JSON Input lesen
$data = json_decode(file_get_contents('php://input'), true);
$username = $data['username'] ?? '';
$role_id = $data['role_id'] ?? null;

if (!$username) {
    echo json_encode(['success' => false, 'message' => 'Username missing']);
    exit;
}

// Pending User abfragen (inkl. role_id)
$stmt = $pdo->prepare("SELECT password, role FROM pending_user WHERE username = :username");
$stmt->execute(['username' => $username]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    echo json_encode(['success' => false, 'message' => 'Pending user not found']);
    exit;
}

// Wenn keine role_id übergeben, Default auf 4 (Student)
if (!$role_id) {
    // role aus DB prüfen und Mapping auf role_id
    switch(strtolower($user['role'])) {
        case 'admin': $role_id = 1; break;
        case 'secretariat': $role_id = 2; break;
        case 'lecturer': $role_id = 3; break;
        case 'student': $role_id = 4; break;
        default: $role_id = 4;
    }
}

// In "user" Tabelle einfügen
$stmtInsert = $pdo->prepare("INSERT INTO user (username, password, role_id, active) VALUES (:username, :password, :role_id, 1)");
$success = $stmtInsert->execute([
    'username' => $username,
    'password' => $user['password'],
    'role_id'  => $role_id
]);

if ($success) {
    // Pending User löschen
    $stmtDel = $pdo->prepare("DELETE FROM pending_user WHERE username = :username");
    $stmtDel->execute(['username' => $username]);

    echo json_encode(['success' => true, 'message' => 'User approved successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error inserting user']);
}
?>
