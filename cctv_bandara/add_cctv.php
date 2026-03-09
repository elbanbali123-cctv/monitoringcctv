<?php
require 'config.php';
header('Content-Type: application/json');

function input($k){
    return isset($_POST[$k]) ? trim($_POST[$k]) : null;
}

$id = input('id'); // kalau ada => update
$nama = input('nama');
$ip = input('ip');
$url = input('url');
$status = input('status') ?: 'DOWN';
$lat = input('lat') !== null && input('lat') !== '' ? (float)input('lat') : null;
$lng = input('lng') !== null && input('lng') !== '' ? (float)input('lng') : null;
$jumlah_kamera = intval(input('jumlah_kamera') ?: 1);
$kamera_up = intval(input('kamera_up') ?: 0);
$kamera_down = intval(input('kamera_down') ?: 0);

if($id){ // update
    $stmt = $mysqli->prepare("UPDATE cctv SET nama=?, ip=?, url=?, status=?, lat=?, lng=?, jumlah_kamera=?, kamera_up=?, kamera_down=? WHERE id=?");
    $stmt->bind_param('ssssddiiii', $nama, $ip, $url, $status, $lat, $lng, $jumlah_kamera, $kamera_up, $kamera_down, $id);
    if($stmt->execute()){
        echo json_encode(['success'=>true,'message'=>'Data diperbarui']);
    } else {
        echo json_encode(['success'=>false,'error'=>$stmt->error]);
    }
    $stmt->close();
    exit;
}

// insert
$stmt = $mysqli->prepare("INSERT INTO cctv (nama, ip, url, status, lat, lng, jumlah_kamera, kamera_up, kamera_down) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param('sssssddii', $nama, $ip, $url, $status, $lat, $lng, $jumlah_kamera, $kamera_up, $kamera_down);
// NOTE: mysqli requires types that match; ensure lat/lng may be null -> cast to string null handling
// To avoid warning, convert null floats to null values with explicit logic:
if ($lat === null) { $lat_param = null; } else { $lat_param = $lat; }
if ($lng === null) { $lng_param = null; } else { $lng_param = $lng; }
// But bind_param doesn't accept null directly for non-objects; we use the prepared statement above directly.
$stmt = $mysqli->prepare("INSERT INTO cctv (nama, ip, url, status, lat, lng, jumlah_kamera, kamera_up, kamera_down) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param('ssssddiii', $nama, $ip, $url, $status, $lat, $lng, $jumlah_kamera, $kamera_up, $kamera_down);

if($stmt->execute()){
    echo json_encode(['success'=>true,'message'=>'Data ditambahkan','insert_id'=>$stmt->insert_id]);
} else {
    echo json_encode(['success'=>false,'error'=>$stmt->error]);
}
$stmt->close();
