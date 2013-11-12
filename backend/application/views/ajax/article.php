<?php
header('Content-type: application/json');
$json   = (array)$article;
echo json_encode($json);
?>
