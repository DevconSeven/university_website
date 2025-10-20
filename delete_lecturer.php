<?php
header("Content-Type: application/json");
require_once "db_connection.php"; // stellt $pdo bereit

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['lecturer_id']) || !is_numeric($data['lecturer_id'])) {
    http_response_code(400);
    echo json_encode(["error" => "Missing or invalid lecturer ID."]);
    exit;
}

$lecturer_id = intval($data['lecturer_id']);

$sql = "DELETE FROM lecturers WHERE lecturer_id = ?";
$stmt = $pdo->prepare($sql);

if ($stmt->execute([$lecturer_id])) {
    if ($stmt->rowCount() > 0) {
        echo json_encode(["success" => true, "message" => "Dozent erfolgreich gelöscht."]);
    } else {
        echo json_encode(["success" => false, "message" => "Kein Dozent mit dieser ID gefunden."]);
    }
} else {
    http_response_code(500);
    echo json_encode(["error" => "Fehler beim Löschen des Dozenten."]);
}
?>
