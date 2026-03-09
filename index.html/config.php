<?php
$host = "localhost";
$user = "root";
$pass = "";
$db   = "cctv_dashboard";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
  die("Koneksi database gagal");
}
?>
