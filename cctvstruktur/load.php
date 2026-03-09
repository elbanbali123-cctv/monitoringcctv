<?php
include "koneksi.php";

$result = mysqli_query($koneksi, "SELECT * FROM cctv ORDER BY id DESC");

$data = [];
while ($row = mysqli_fetch_assoc($result)) {
    $data[] = $row;
}

echo json_encode($data);
?>
