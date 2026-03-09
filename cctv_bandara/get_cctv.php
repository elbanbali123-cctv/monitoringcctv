<?php
require 'config.php';
header('Content-Type: application/json');

$res = $mysqli->query("SELECT * FROM cctv ORDER BY id DESC");
$data = [];
while($r = $res->fetch_assoc()){
    $data[] = $r;
}
echo json_encode(['success' => true, 'data' => $data]);
