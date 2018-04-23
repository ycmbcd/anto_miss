<?php
$dir = dirname(__FILE__);
require_once($dir."/../header.php");

//查询字段
if(isset($_GET['get_choose_field'])){
    $field = $_GET['get_choose_field'];
    $sql = "SELECT * FROM miss_field WHERE miss_field = '{$field}' ORDER BY id";
    $res = $db->getAll($sql);
    echo json_encode($res);
}

//新建miss字段
if(isset($_GET['new_miss_choose_field'])){
    $field = $_GET['new_miss_choose_field'];
    $field_name = addslashes($_GET['new_field_name']);
    //查询是否存在
    $sql = "SELECT * FROM miss_field WHERE miss_field = '{$field}' AND field_name = '{$field_name}'";
    $res = $db->getOne($sql);
    if(empty($res)){
        $sql = "INSERT INTO miss_field(miss_field,field_name) values ('{$field}','{$field_name}')";
        $res = $db->execute($sql);
        echo 'ok';
    }else{
        echo "has";
    }
    
}

//删除miss字段
if(isset($_GET['del_miss_choose'])){
    $del_field_id = $_GET['del_miss_choose'];
    //删除雅虎字段属性表
    $sql = "DELETE FROM miss_field where id='{$del_field_id}'";
    $res = $db->execute($sql);
    echo "ok";
}