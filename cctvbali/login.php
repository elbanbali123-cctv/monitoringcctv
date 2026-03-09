<?php
session_start();
include "config.php";

if (isset($_POST['login'])) {
    $user = $_POST['username'];
    $pass = $_POST['password'];

    $q = mysqli_query($conn, "SELECT * FROM users WHERE username='$user'");
    $data = mysqli_fetch_assoc($q);

    if ($data && password_verify($pass, $data['password'])) {
        $_SESSION['login'] = true;
        $_SESSION['user'] = $data['username'];
        header("Location: index.php");
    } else {
        echo "<script>alert('Login gagal');</script>";
    }
}
?>

<!DOCTYPE html>
<html>
<head>
<title>Login CCTV</title>
</head>
<body>
<h2>Login Dashboard CCTV</h2>
<form method="post">
<input type="text" name="username" placeholder="Username" required><br><br>
<input type="password" name="password" placeholder="Password" required><br><br>
<button name="login">Login</button>
</form>
</body>
</html>
