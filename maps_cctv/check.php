<?php
header("Content-Type: application/json");

// Ambil IP + PORT (format: 10.2.59.45:8080)
$raw = $_GET['ip'] ?? '';

if (!$raw) {
    echo json_encode(["status" => "DOWN"]);
    exit;
}

$parts = explode(":", $raw);
$ip = $parts[0];
$port = isset($parts[1]) ? intval($parts[1]) : 80;

// Tes koneksi socket langsung ke kamera
$connection = @fsockopen($ip, $port, $errno, $errstr, 2);

if ($connection) {
    fclose($connection);
    echo json_encode(["status" => "UP"]);
} else {
    echo json_encode(["status" => "DOWN"]);
}
?>
