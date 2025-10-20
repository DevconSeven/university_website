<?php
header('Content-Type: application/json');
ini_set('display_errors', 1);
error_reporting(E_ALL);
require_once "db_connection.php";  // stellt $pdo bereit

$data = json_decode(file_get_contents("php://input"), true);

$student_firstname = $data['student_firstname'] ?? null;
$student_lastname  = $data['student_lastname'] ?? null;
$student_age       = $data['student_age'] ?? null;
$student_mail      = $data['student_mail'] ?? null;
$student_address   = $data['student_address'] ?? null;
$subject_id        = $data['subject_id'] ?? null;

if (!$student_firstname || !$student_lastname || !$student_age || !$student_mail || !$student_address || !$subject_id) {
    echo json_encode(["status" => "error", "message" => "Missing required fields"]);
    exit;
}

$sql = "INSERT INTO students (student_firstname, student_lastname, student_age, student_mail, student_address, subject_id)
        VALUES (:student_firstname, :student_lastname, :student_age, :student_mail, :student_address, :subject_id)";

$stmt = $pdo->prepare($sql);

$params = [
    ':student_firstname' => $student_firstname,
    ':student_lastname'  => $student_lastname,
    ':student_age'       => $student_age,
    ':student_mail'      => $student_mail,
    ':student_address'   => $student_address,
    ':subject_id'        => $subject_id,
];

if ($stmt->execute($params)) {
    echo json_encode(["status" => "success", "message" => "Student inserted"]);
} else {
    echo json_encode(["status" => "error", "message" => "Error inserting student"]);
}
