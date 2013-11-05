<?php
$json = array(
    'cid' => $cid,
    'category' => $category,
    'page' => $page,
    'posts' => $posts
);
echo json_encode($json);
?>
