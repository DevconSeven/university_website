<?php
header('Content-Type: application/json');
ini_set('display_errors', 1);
error_reporting(E_ALL);
require_once "db_connection.php"; // stellt $pdo bereit

$sql = "
    SELECT 
        l.lecturer_id, 
        l.lecturer_firstname, 
        l.lecturer_lastname, 
        l.entry_date, 
        l.subject_id,
        subj.subject AS subject_name
    FROM lecturers l
    LEFT JOIN subjects subj ON l.subject_id = subj.subject_id
";

try {
    $stmt = $pdo->query($sql);
    $lecturers = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (!$lecturers) {
        http_response_code(404);
        echo json_encode(["error" => "Keine Dozenten gefunden."]);
        exit();
    }

    echo json_encode($lecturers);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "SQL Fehler: " . $e->getMessage()]);
}
