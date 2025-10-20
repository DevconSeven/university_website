<?php
// check_session.php
// Überprüft, ob ein User angemeldet ist und gibt Username & Rolle zurück
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'domain' => 'localhost',
    'secure' => false,   // true wenn HTTPS
    'httponly' => true,
    'samesite' => 'Lax'  // oder 'None' bei cross-site
]);
session_start();

if (isset($_SESSION['username']) && isset($_SESSION['role'])) {
    // Der Benutzer ist eingeloggt, Session-Daten verfügbar
    echo json_encode([
        'loggedIn' => true,
        'username' => $_SESSION['username'],
        'role' => $_SESSION['role']
    ]);
} else {
    // Nicht eingeloggt
    echo json_encode(['loggedIn' => false]);
}
?>