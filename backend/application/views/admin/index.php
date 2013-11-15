<form action="admin/action" method="POST" id="actionform">
<input id="actinput" name="action" type="hidden" />
<?php
if ($user['role'] == 'admin' || $user['role'] == 'writer') {
    echo '<div id="opt"><a href="./admin/edit">增加一篇文章</a><button onclick="publish();">发布</button><button onclick="unpublish();">收回</button></div>';
}
?>
<table>
    <th><td>编号</td><td>已发布</td><td>标题</td><td>作者</td><td>分类</td><td>最后修改时间</td></th>
<?
foreach($posts_list as $post){
    echo '<tr><td><input type="checkbox" name="ck['.$post->id.']" /></td><td>'.
        $post->id."</td><td>".$post->publish.'</td><td><a href="./admin/edit/'.$post->id.'">'.$post->title.
        "</a></td><td>".$post->author."</td><td>".$post->category."</td><td>".$post->date."</td></tr>";
}
?>
</table>
</form>
<script type="text/javascript">
function addpost() {
    document.getElementById('actinput').value = 'add';
}
function publish() {
    document.getElementById('actinput').value = 'publish';
}
function unpublish() {
    document.getElementById('actinput').value = 'unpublish';
}
</script>
