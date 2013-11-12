<?php
header('Content-type: application/json');
$json = (object)$data;
echo json_encode($json);
?>
