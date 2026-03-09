<?php
require 'config.php';
header('Content-Type: application/json');

$id = isset($_POST['id']) ? intval($_POST['id']) : 0;
if(!$id){
    echo json_encode(['success'=>false,'error'=>'ID tidak valid']);
    exit;
}
$stmt = $mysqli->prepare("DELETE FROM cctv WHERE id = ?");
$stmt->bind_param('i', $id);
if($stmt->execute()){
    echo json_encode(['success'=>true,'message'=>'Terhapus']);
} else {
    echo json_encode(['success'=>false,'error'=>$stmt->error]);
}
$stmt->close();
