<html>
<head>
<meta charset='utf-8'>
</head>
<body>
<pre>
<?php
include('phpquery.php');

phpQuery::newDocumentFileXML('wordpress.xml');

$cates = array();
$posts = array();

function getCdata($tagname, $html, $attr=''){
    preg_match("#<$tagname $attr.*?><!\[CDATA\[(.*?)\]\]></$tagname>#", $html, $matches);
    if (array_key_exists(1, $matches)){
        return $matches[1];
    }
    else {
        return '';
    }
}

function getdata($tagname, $html){
    preg_match("#<$tagname.*?>(.*?)</$tagname>#", $html, $matches);
    if (array_key_exists(1, $matches)){
        return $matches[1];
    }
    else {
        return '';
    }
}

function addCates($cate){
    global $cates;
    $html = pq($cate)->html();
    array_push($cates, (object)array(
        'name' => getCdata('wp:cat_name', $html),
        'description' => getCdata('wp:category_description', $html)
    ));
}

function find_obj($category, $cates){
    foreach($cates as $id => $obj){
        if ($obj->name == $category)
            return $id;
    }
}

function addPosts($post){
    global $cates, $posts;
    $html = pq($post)->html();
    $html = str_replace("\n", '', $html);
    $category = getCdata('category', $html, 'domain="category"');
    $cid = 0;
    if ($category != '') {
        $cid = find_obj($category, $cates);
    }
    array_push($posts, (object)array(
        'publish' => 1,
        'title' => getdata('title', $html),
        'author' => 'clarkok',
        'auid' => 1,
        'category' => $category,
        'cid' => $cid,
        'content' => getCdata('content:encoded', $html)
    ));
}

function Insert(){
    global $cates, $posts;
    $con = mysql_connect('localhost', 'clog', 'qR4smSWbNcKpvrxu');
    mysql_select_db('clog', $con);
    mysql_query('SET NAMES UTF8');

    foreach ($cates as $cate){
        var_dump($cate);
        mysql_query('INSERT INTO category (name, description) VALUES ("'.
            mysql_real_escape_string($cate->name, $con).'","'.
            mysql_real_escape_string($cate->description, $con).'")');
    }

    foreach ($posts as $post){
        $post->cid += 1;
        var_dump($post);
        mysql_query('INSERT INTO posts (publish, title, author, auid, category, cid, content) VALUES ("'.
            mysql_real_escape_string($post->publish, $con).'","'.
            mysql_real_escape_string($post->title, $con).'","'.
            mysql_real_escape_string($post->author, $con).'","'.
            mysql_real_escape_string($post->auid, $con).'","'.
            mysql_real_escape_string($post->category, $con).'","'.
            mysql_real_escape_string($post->cid, $con).'","'.
            mysql_real_escape_string($post->content, $con).'")');

        mysql_query('UPDATE category SET posts = posts + 1 WHERE id='.
            mysql_real_escape_string($post->cid, $con));
    }

    mysql_close($con);
}

pq('wp|category')->each('addCates');
pq('channel')->children('item')->each('addPosts');

Insert();

?>
</pre>
</body>
</html>
