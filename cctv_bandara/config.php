<?php
// config.php
date_default_timezone_set('Asia/Makassar');

define('DB_HOST','127.0.0.1');
define('DB_NAME','cctv_dashboard');
define('DB_USER','root'); // ganti jika perlu
define('DB_PASS','');     // ganti jika perlu

$mysqli = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
if ($mysqli->connect_errno) {
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Database connection failed: ' . $mysqli->connect_error]);
    exit;
}
$mysqli->set_charset('utf8mb4');
