<?php
session_start();
require 'db_connection.php'; // stellt $pdo bereit

header('Content-Type: application/json');

try {
    $stmt = $pdo->prepare("
        SELECT u.user_id, u.username, r.role_name, u.active
        FROM user u
        JOIN roles r ON u.role_id = r.role_id
    ");
    $stmt->execute();
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($users);

} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>
