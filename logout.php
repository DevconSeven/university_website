<?php
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'domain' => 'localhost',
    'secure' => false,   // true wenn HTTPS
    'httponly' => true,
    'samesite' => 'Lax'  // oder 'None' bei cross-site
]);
session_start();
session_unset();
session_destroy();
http_response_code(200); // OK
echo json_encode(["success" => true]);
exit;