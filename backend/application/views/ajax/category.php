<?php
header('Content-type: application/json');
$json = array(
    'cid' => $cid,
    'category' => $category,
    'page' => $page,
    'posts' => $posts
);
echo json_encode($json);
?>
