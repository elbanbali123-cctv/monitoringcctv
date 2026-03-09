<?php
include "auth_check.php";
include "config.php";

$total = mysqli_num_rows(mysqli_query($conn, "SELECT * FROM cctv"));
$up    = mysqli_num_rows(mysqli_query($conn, "SELECT * FROM cctv WHERE status='UP'"));
$down  = mysqli_num_rows(mysqli_query($conn, "SELECT * FROM cctv WHERE status='DOWN'"));
?>

<!DOCTYPE html>
<html>
<head>
<title>Dashboard CCTV</title>
<link rel="stylesheet" href="assets/style.css">
</head>
<body>

<h2>Dashboard CCTV</h2>
<a href="logout.php">Logout</a>

<div class="summary">
  <div>Total: <?= $total ?></div>
  <div class="up">UP: <?= $up ?></div>
  <div class="down">DOWN: <?= $down ?></div>
</div>

<form method="post" action="add_cctv.php">
<input name="nama" placeholder="Nama CCTV" required>
<input name="lokasi" placeholder="Lokasi">
<input name="ip" placeholder="IP Address">
<select name="status">
  <option value="UP">UP</option>
  <option value="DOWN">DOWN</option>
</select>
<button>Tambah</button>
</form>

<table border="1" cellpadding="5">
<tr>
<th>Nama</th><th>Lokasi</th><th>IP</th><th>Status</th><th>Aksi</th>
</tr>

<?php
$q = mysqli_query($conn, "SELECT * FROM cctv");
while ($d = mysqli_fetch_assoc($q)) {
?>
<tr>
<td><?= $d['nama_cctv'] ?></td>
<td><?= $d['lokasi'] ?></td>
<td><?= $d['ip_address'] ?></td>
<td><?= $d['status'] ?></td>
<td>
<a href="edit_cctv.php?id=<?= $d['id'] ?>">Edit</a> |
<a href="delete_cctv.php?id=<?= $d['id'] ?>" onclick="return confirm('Hapus?')">Hapus</a>
</td>
</tr>
<?php } ?>
</table>

</body>
</html>
