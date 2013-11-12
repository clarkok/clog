<?php 
if (isset($location)) header('Location:'.$location); 
if (isset($cookies))
    foreach ($cookies as $cookie){
        setcookie($cookie->name, $cookie->value, $cookie->expire);
    }
?>
<!doctype html>
<html>
    <head>
        <meta charset="utf-8">
        <title>登录Clog</title>
<style type="text/css">
h1 {
    text-align:center;
}
div#login {
    position:relative;
    width:300px;
    margin:auto;
    font-size:16px;
    background-color:#fffbbb;
    padding:3em;
    padding-top:1em;
}
div#error {
    background-color: pink;
    border: 1px solid red;
    width:300px;
    margin:auto;
    position:relative;
}
input {
    width:10em;
    float:right;
    font-size:16px;
    margin:0px;
    padding:0px;
    border:0px;
}
input#submit {
    width:300px;
}
</style>
    </head>
<body>
    <?php if(isset($errmsg)) echo "<div id=\"error\">$errmsg</div>"; ?>
    <h1>登录Clog</h1>
    <div id="login">
        <form id="loginform" action="./login" method="POST">
            <p><label>Email: </label><input id="email" name="_email" type="email" /></p>
            <p><label>Password: </label><input id="pass" name="_pass" type="password" /></p>
            <input id="submit" name="submit" type="submit" />
        </form>
    </div>
</body>
            
