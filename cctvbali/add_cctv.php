<?php
include "config.php";

mysqli_query($conn, "INSERT INTO cctv 
(nama_cctv, lokasi, ip_address, status)
VALUES (
'$_POST[nama]',
'$_POST[lokasi]',
'$_POST[ip]',
'$_POST[status]'
)");

header("Location: index.php");
