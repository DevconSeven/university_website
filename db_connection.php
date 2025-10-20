<?php
/**
 * db_connection.php
 * -----------------
 * Stellt die Verbindung zur MySQL-Datenbank her.
 * Diese Datei wird von allen PHP-Skripten (z. B. login.php, admin.php usw.) eingebunden.
 *
 * Hinweis:
 *   - Für lokale XAMPP-Umgebungen unter macOS sollte 127.0.0.1 statt 'localhost' genutzt werden,
 *     um den "No such file or directory"-Fehler zu vermeiden.
 *   - In produktiven Umgebungen sollte die Fehleranzeige deaktiviert werden.
 */

// --- Fehlerausgabe aktivieren (nur für Entwicklung) ---
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// --- Zugangsdaten zur Datenbank ---
$servername = "127.0.0.1";   // oder "localhost" – je nach Umgebung
$username   = "root";         // Datenbank-Benutzername
$password   = "";             // Passwort (leer bei XAMPP)
$dbname     = "uni";          // Name deiner Datenbank

// --- Verbindung mit PDO aufbauen ---
try {
    $pdo = new PDO(
        "mysql:host=$servername;dbname=$dbname;charset=utf8mb4",
        $username,
        $password,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, // Fehler als Exceptions
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC // Arrays statt Objekte
        ]
    );
} catch (PDOException $e) {
    // Verbindung fehlgeschlagen → JSON-Fehlerausgabe
    echo json_encode([
        "success" => false,
        "message" => "Database connection failed: " . $e->getMessage()
    ]);
    exit;
}
?>