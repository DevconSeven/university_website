<?php
header('Content-Type: application/json');
ini_set('display_errors', 1);
error_reporting(E_ALL);
require_once "db_connection.php";  // stellt $pdo bereit

$data = json_decode(file_get_contents("php://input"), true);

$lecturer_firstname = $data['lecturer_firstname'] ?? null;
$lecturer_lastname  = $data['lecturer_lastname'] ?? null;
$entry_date         = $data['entry_date'] ?? null;  // z.B. "2025-05-24"
$subject_id         = $data['subject_id'] ?? null;

if (!$entry_date || !$subject_id) {
    echo json_encode(["status" => "error", "message" => "Missing required fields"]);
    exit;
}

$sql = "INSERT INTO lecturers (lecturer_firstname, lecturer_lastname, entry_date, subject_id) 
        VALUES (:lecturer_firstname, :lecturer_lastname, :entry_date, :subject_id)";
$stmt = $pdo->prepare($sql);

$params = [
    ':lecturer_firstname' => $lecturer_firstname,
    ':lecturer_lastname'  => $lecturer_lastname,
    ':entry_date'         => $entry_date,
    ':subject_id'         => $subject_id,
];

if ($stmt->execute($params)) {
    echo json_encode(["status" => "success", "message" => "Lecturer inserted"]);
} else {
    echo json_encode(["status" => "error", "message" => "Error inserting lecturer"]);
}
