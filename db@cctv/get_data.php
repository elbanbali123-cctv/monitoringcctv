<?php
include "config.php";

$sql = "SELECT * FROM cctv3lbanball";
$result = $conn->query($sql);

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);
?>
