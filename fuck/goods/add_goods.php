<?php
$dir = dirname(__FILE__);
require_once($dir."/../header.php");

//查询赋值选项
if(isset($_GET['field_option'])){
    $id = $_GET['field_option'];
    $from_table = $_GET['from_table'];
    $from_table = $from_table.'_field';
    $sql = "SELECT field_option FROM $from_table where id='{$id}'";
    $res = $db->getOne($sql);
    $arr = explode(',', $res['field_option']);
    echo json_encode($arr);
}

//添加miss
if(isset($_POST['add_miss'])){
    $u_name = addslashes($_POST['u_name']);
    $date_today = addslashes($_POST['date_today']);
    $missdate = addslashes($_POST['missdate']);
    $account = addslashes($_POST['account']);
    $luozha = addslashes($_POST['luozha']);
    $receive_name = addslashes($_POST['receive_name']);
    $miss_who = addslashes($_POST['miss_who']);
    $miss_num = addslashes($_POST['miss_num']);
    $miss_type = addslashes($_POST['miss_type']);
    $miss_info = addslashes($_POST['miss_info']);
    $miss_solution = addslashes($_POST['miss_solution']);
    $miss_send = addslashes($_POST['miss_send']);
    $miss_who = addslashes($_POST['miss_who']);
    $miss_back = addslashes($_POST['miss_back']);
    $miss_ems = addslashes($_POST['miss_ems']);
    $miss_money = addslashes($_POST['miss_money']);
    $back_ems = addslashes($_POST['back_ems']);
    $back_money = addslashes($_POST['back_money']);
    $back_hand_money = addslashes($_POST['back_hand_money']);
    $back_sku = addslashes($_POST['back_sku']);
    $cost_lost = addslashes($_POST['cost_lost']);
    if($miss_ems==undefined){
        $miss_ems = '';
    }
    if($back_ems==undefined){
        $back_ems = '';
    }

    //插入数据
    $sql = "INSERT INTO miss_table (make_date,make_name,miss_date,account,luozha,receive_name,miss_who,miss_num,miss_type,miss_info,miss_solution,miss_send,miss_back,miss_ems,miss_money,back_ems,back_money,back_hand_money,back_sku,cost_lost) VALUES ('{$date_today}','{$u_name}','{$missdate}','{$account}','{$luozha}','{$receive_name}','{$miss_who}','{$miss_num}','{$miss_type}','{$miss_info}','{$miss_solution}','{$miss_send}','{$miss_back}','{$miss_ems}','{$miss_money}','{$back_ems}','{$back_money}','{$back_hand_money}','{$back_sku}','{$cost_lost}')";
    $res = $db->execute($sql);
    echo "ok";
}
?>