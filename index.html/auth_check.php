<?php
session_start();
if (!isset($_SESSION['login'])) {
  http_response_code(401);
  exit('Unauthorized');
}
?>
