<?php
header('Content-type: application/json');
$json = array(
    'errno' => 404
);
echo json_encode($json);
?>
