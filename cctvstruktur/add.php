<?php
include "koneksi.php";

$nama   = $_POST['nama'];
$ip     = $_POST['ip'];
$url    = $_POST['url'];
$status = $_POST['status'];
$lat    = $_POST['lat'];
$lng    = $_POST['lng'];

mysqli_query($koneksi, "INSERT INTO cctv (nama, ip, url, status, lat, lng)
VALUES ('$nama', '$ip', '$url', '$status', '$lat', '$lng')");

echo "OK";
?>
