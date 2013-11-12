<!doctype html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Clog后台管理<?php if (isset($cid)) { echo '|'; if ($cid == -1) echo "All"; else echo $category->name; } ?></title>
    </head>
<body>
    <div id="top">
        <div id="catelist">
            <ul id="toplist">
<?php
foreach ($category_list as $category) {
    echo '<li id="cate'.$category->id.'"><a href="./'.$category->id.'">'.$category->name.'</a></li>';
}
?>
            </ul>
        </div>
        <div id="userinfo">
        <p><?php echo $user['nickname']; ?></p>
        <p><a href="./logout">登出</a></p>
        </div>
    </div>
