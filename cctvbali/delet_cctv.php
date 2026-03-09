<?php
include "config.php";
mysqli_query($conn, "DELETE FROM cctv WHERE id=$_GET[id]");
header("Location: index.php");
