<?php
include "koneksi.php";

$id = $_GET['id'];
mysqli_query($koneksi, "DELETE FROM cctv WHERE id='$id'");

echo "OK";
?>
