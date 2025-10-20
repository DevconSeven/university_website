<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Content-Type: application/json");
require_once "db_connection.php"; // stellt $pdo bereit

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['student_id']) || !is_numeric($data['student_id'])) {
    http_response_code(400);
    echo json_encode(["error" => "Missing or invalid student ID."]);
    exit;
}

$student_id = intval($data['student_id']);

$sql = "DELETE FROM students WHERE student_id = ?";
$stmt = $pdo->prepare($sql);

if ($stmt->execute([$student_id])) {
    if ($stmt->rowCount() > 0) {
        echo json_encode(["success" => true, "message" => "Student erfolgreich gelöscht."]);
    } else {
        echo json_encode(["success" => false, "message" => "Kein Student mit dieser ID gefunden."]);
    }
} else {
    http_response_code(500);
    echo json_encode(["error" => "Fehler beim Löschen des Studenten."]);
}
