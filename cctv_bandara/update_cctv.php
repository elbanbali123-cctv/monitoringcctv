<?php
require 'config.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
if(!$data || !isset($data['id'])){
    echo json_encode(['success'=>false,'error'=>'Invalid payload']);
    exit;
}
$id = intval($data['id']);
// sanitasi dan set variabel seperti di add_cctv...
// Untuk ringkas gunakan prepared update mirip add_cctv.php
echo json_encode(['success'=>false,'error'=>'Gunakan add_cctv.php dengan field id untuk update.']);
