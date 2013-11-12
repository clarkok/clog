<form id="editform" action='./action' method='POST'>
    <input name="action" type="hidden" value="post" />
    <?php if(isset($post)) echo '<input name="id" type="hidden" value="'.$post->id.'" />' ?>
    <table>
    <tr><td>标题</td><td><input name="title" type="text" <?php if (isset($post)) echo 'value="'.$post->title.'"' ?>></td>
        <td>分类</td><td><select name="category">
<?php
foreach ($category_list as $category){
    echo '<option value="'.$category->id.'">'.$category->name.'</option>';
};
?>
        </select></td></tr>
        <tr><td colspan="4"><textarea name="content"><?php if(isset($post)) echo $post->content; ?></textarea></td></tr>
        <tr><td colspan="4"><input type="submit" name="submit" value="submit" /></td></tr>
</form>
