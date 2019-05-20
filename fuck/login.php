<?php
//开启session
session_start();

$dir = dirname(__FILE__);
require_once($dir."/../pdo/PdoMySQL.class.php");//PDO
$db = new PdoMySQL();

// 获取语言
if(isset($_GET['get_lang'])){
	$u_num = $_SESSION['miss_u_num'];
	$sql = "SELECT u_lang FROM user_company WHERE u_num='{$u_num}'";
	$res = $db->getOne($sql);
	echo $res['u_lang'];
}

// 更新语言
if(isset($_GET['cg_lang'])){
	$u_num = $_SESSION['miss_u_num'];
	$cg_lang = $_GET['cg_lang'];
	$sql = "UPDATE user_company SET u_lang = '{$cg_lang}' WHERE u_num='{$u_num}'";
	$res = $db->execute($sql);
	echo 'ok';
}

//登录验证
if(isset($_POST['u_num'])){
	$u_num = $_POST['u_num'];
	$u_pwd = $_POST['u_pwd'];
	$u_lang = $_POST['u_lang'];
	$u_num = addslashes($u_num);   //防止SQL注入
	$u_pwd = addslashes($u_pwd);   
	$sql = "SELECT * FROM user_company WHERE u_num='{$u_num}' AND u_pwd='{$u_pwd}'";
    $res = $db->getOne($sql);

    if(empty($res)){
        echo "0";
    }else{
		$_SESSION['miss_u_num'] = $u_num;
		$_SESSION['miss_u_name'] = $res['u_name'];
		$sql = "UPDATE user_company SET u_lang = '{$u_lang}' WHERE u_num = '{$u_num}'";
		$res = $db->execute($sql);
    	echo "go";
    }
}

//输出u_name
if(isset($_GET['u_name'])){
	@$u_name = $_SESSION['miss_u_name'];
	if($u_name==''){
		echo 'logout';die;
	}
	echo $_SESSION['miss_u_name'];
}

//输出日期
if(isset($_GET['date_today'])){
echo date('Y-m-d',time());
}

//修改密码
if(isset($_POST['change_pwd'])){
	$old_pwd = $_POST['change_pwd'];
	$new_pwd = $_POST['new_pwd'];
	$re_pwd = $_POST['re_pwd'];
	$old_pwd = addslashes($old_pwd);   //防止SQL注入
	$new_pwd = addslashes($new_pwd);   
	$re_pwd = addslashes($re_pwd);   
	if($new_pwd!==$re_pwd){
		echo "error";
		return false;
	}
	$user = $_SESSION['miss_u_num'];
	$sql = "SELECT * FROM user_company WHERE u_num = $user AND u_pwd='{$old_pwd}'";
    $res = $db->getOne($sql);

    if(empty($res)){
        echo "0";
    }else{
    	//修改
    	$sql = "UPDATE user_company SET u_pwd='{$new_pwd}' WHERE u_num = $user";
    	$res = $db->execute($sql);
    	echo "ok";
    }
}

//查询所有员工
if(isset($_POST['show_users'])){
    $sql = "SELECT * FROM user_company WHERE u_num>1000 ORDER BY id";
    $res = $db->getAll($sql);
    echo json_encode($res);
}

//添加新员工
if(isset($_POST['add_user'])){
	$add_user = addslashes($_POST['add_user']);
    $sql = "SELECT * FROM user_company WHERE u_name='{$add_user}'";
    $res = $db->getOne($sql);

    if(empty($res)){
    	//搜出最近工号
    	$sql = "SELECT max(u_num) as mm from user_company";
    	$res = $db->getOne($sql);
    	$new_num = $res['mm']+1;
        $sql = "INSERT INTO user_company (u_num,u_name,u_pwd)VALUES ('{$new_num}','{$add_user}','123456')";
        $res = $db->execute($sql);
    	echo "ok";
    }else{
		echo 'has';
    }
}

//删除员工
if(isset($_POST['del_user'])){
    $del_user = $_POST['del_user'];
    //删除雅虎字段属性表
    $sql = "DELETE FROM user_company where u_num='{$del_user}'";
    $res = $db->execute($sql);
    echo "ok";
}

//退出
if(isset($_GET['logout'])){
	session_destroy();
	echo "<script>window.location='/index.html';</script>";
}
