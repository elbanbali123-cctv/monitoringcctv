<?php
include "config.php";
$id = $_GET['id'];

if (isset($_POST['update'])) {
    mysqli_query($conn, "UPDATE cctv SET
    nama_cctv='$_POST[nama]',
    lokasi='$_POST[lokasi]',
    ip_address='$_POST[ip]',
    status='$_POST[status]'
    WHERE id=$id");
    header("Location: index.php");
}

$data = mysqli_fetch_assoc(mysqli_query($conn, "SELECT * FROM cctv WHERE id=$id"));
?>

<form method="post">
<input name="nama" value="<?= $data['nama_cctv'] ?>">
<input name="lokasi" value="<?= $data['lokasi'] ?>">
<input name="ip" value="<?= $data['ip_address'] ?>">
<select name="status">
<option <?= $data['status']=="UP"?"selected":"" ?>>UP</option>
<option <?= $data['status']=="DOWN"?"selected":"" ?>>DOWN</option>
</select>
<button name="update">Update</button>
</form>
