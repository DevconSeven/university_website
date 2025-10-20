<?php
header('Content-Type: application/json');
ini_set('display_errors', 1);
error_reporting(E_ALL);
require_once "db_connection.php"; // stellt $pdo bereit

$sql = "SELECT s.student_id, s.student_firstname, s.student_lastname, s.student_age, s.student_address, s.student_mail, s.subject_id, subj.subject AS subject_name
        FROM students s
        LEFT JOIN subjects subj ON s.subject_id = subj.subject_id";

try {
    $stmt = $pdo->query($sql);
    $students = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (!$students) {
        http_response_code(404);
        echo json_encode(["error" => "Keine Studenten gefunden."]);
        exit();
    }

    echo json_encode($students);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "SQL Fehler: " . $e->getMessage()]);
}
