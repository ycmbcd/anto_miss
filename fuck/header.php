<?php
//开启session
session_start();
@$u_name = $_SESSION['miss_u_name'];
if($u_name==''){
	echo '请登录后再试。1秒钟后跳转...<meta http-equiv="refresh" content="2;url=/index.html" />';die;
}

$dir = dirname(__FILE__);
require_once($dir."/../pdo/PdoMySQL.class.php");//PDO

$db = new PdoMySQL();
?>