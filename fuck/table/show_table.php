<?php
$dir = dirname(__FILE__);
require_once($dir."/../header.php");

//单条miss查看
if(isset($_POST['look_info'])){
    $tb_name = $_POST['look_table'];
    $id = $_POST['look_info'];
    $sql = "SELECT * FROM $tb_name WHERE id = '{$id}'";
    $res =  $db->getOne($sql);
    echo json_encode($res);
}

//查询总数
if(isset($_POST['items_count'])){
    $tb_name = $_POST['items_count'];
    $start_date = $_POST['start_date'];
    $end_date = $_POST['end_date'];
    $field_name = $_POST['field_name'];
    $search_key_words = $_POST['search_key_words'];

    if($field_name=='0'){   //没有筛选条件
        if($start_date =='' or $end_date ==''){
            $sql = "SELECT count(1) as cc FROM $tb_name";   
        }else{
            $sql = "SELECT count(1) as cc FROM $tb_name WHERE make_date BETWEEN '{$start_date}' AND '{$end_date}'";
        }
    }else{
        if($start_date =='' or $end_date ==''){
            $sql = "SELECT count(1) as cc FROM $tb_name WHERE {$field_name} LIKE '%{$search_key_words}%'";   
        }else{
            $sql = "SELECT count(1) as cc FROM $tb_name WHERE make_date BETWEEN '{$start_date}' AND '{$end_date}' AND {$field_name} LIKE '%{$search_key_words}%'";
        }
    }
    
    $res = $db->getOne($sql);
    echo $res['cc'];
    
}

//查询表单
if(isset($_POST['show_table'])){
    $tb_name = $_POST['show_table'];
    $page_size = $_POST['page_size'];
    $start = $_POST['start'];
    $start_date = $_POST['start_date'];
    $end_date = $_POST['end_date'];
    $field_name = $_POST['field_name'];
    $search_key_words = $_POST['search_key_words'];

    if($field_name=='0'){   //0没有筛选条件
        if($start_date =='' or $end_date ==''){
            $sql = "SELECT * FROM $tb_name ORDER BY id DESC limit {$start},{$page_size}";
        }else{
            $sql = "SELECT * FROM $tb_name WHERE make_date BETWEEN '{$start_date}' AND '{$end_date}' ORDER BY id DESC limit {$start},{$page_size} ";
        }
    }else{
        if($start_date =='' or $end_date ==''){
            $sql = "SELECT * FROM $tb_name WHERE {$field_name} LIKE '%{$search_key_words}%' ORDER BY id DESC limit {$start},{$page_size}";
        }else{
            $sql = "SELECT * FROM $tb_name WHERE make_date BETWEEN '{$start_date}' AND '{$end_date}' AND {$field_name} LIKE '%{$search_key_words}%' ORDER BY id DESC limit {$start},{$page_size} ";
        }
    }    
    $res = $db->getAll($sql);
    echo json_encode($res);
}

//单个字段修改
if(isset($_POST['change_field'])){
    $change_field = $_POST['change_field'];
    $id = $_POST['id'];
    $table = $_POST['table'];

    //查询创建人
    $sql = "SELECT make_name FROM $table WHERE id='{$id}'";
    $res = $db->getOne($sql);
    if($res['make_name']== $_SESSION['miss_u_name'] or $_SESSION['miss_u_name']=='唐洁'){
        $new_key = $_POST['new_key'];
        $change_field = addslashes($change_field);   //防止SQL注入

        if($table == 'miss_table'){
            $sql = "UPDATE miss_table SET {$change_field} = '{$new_key}' WHERE id='{$id}'";
            $res = $db->execute($sql);
            echo "ok";
        }
    }else{
        echo "stop";
    }
}

//删除一列
if(isset($_POST['del_id'])){
    $del_id = $_POST['del_id'];
    $table = $_POST['table'];

    $sql = "DELETE FROM $table WHERE id='{$del_id}'";
    $res = $db->execute($sql);
    echo 'ok';
}

//下载表单
if(isset($_POST['down_tb'])){
    $down_tb = $_POST['down_tb'];
    $start_date = $_POST['start_date'];
    $end_date = $_POST['end_date'];

    require_once($dir."/./PHPExcel/PHPExcel.php");//引入PHPExcel
    //加大响应
    set_time_limit(0); 
    ini_set("memory_limit", "1024M");
    //制作时间
    date_default_timezone_set("Asia/Shanghai");
    // $now_time = date("Y-m-d H.i.s");

    //PHPExcel
    $objPHPExcel = new PHPExcel();
    $objSheet = $objPHPExcel->getActiveSheet();
    $objSheet->setTitle($down_tb);//表名
    $objSheet->setCellValue("A1","填写日期")
            ->setCellValue("B1","填写人")
            ->setCellValue("C1","MISS 日期")
            ->setCellValue("D1","账号")
            ->setCellValue("E1","落扎/注文情报")
            ->setCellValue("F1","收件人")
            ->setCellValue("G1","MISS 方")
            ->setCellValue("H1","MISS 数")
            ->setCellValue("I1","MISS 类型")
            ->setCellValue("J1","MISS 详情")
            ->setCellValue("K1","处理结果")
            ->setCellValue("L1","MISS 对应发送方式")
            ->setCellValue("M1","已返品")
            ->setCellValue("N1","再送单号")
            ->setCellValue("O1","再送运费")
            ->setCellValue("P1","返品单号")
            ->setCellValue("Q1","返品运费")
            ->setCellValue("R1","返品手续费")
            ->setCellValue("S1","成本损失")
            ->setCellValue("T1","合计损失")
            ->setCellValue("U1","漏/误发产品代码")
            ->setCellValue("V1","汇率")
            ->setCellValue("W1","人民币合计");    //表头值
    $objSheet->getDefaultStyle()->getFont()->setName("微软雅黑")->setSize(12);  //默认字体
    $objPHPExcel->getActiveSheet()->getStyle('A1:Z1')->getAlignment()->setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);//垂直居中
    $objPHPExcel->getActiveSheet()->getStyle('A:Z')->getAlignment()->setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);//垂直居中
    $objPHPExcel->getActiveSheet()->getStyle('A1:Z1')->getFont()->getColor()->setARGB(PHPExcel_Style_Color::COLOR_WHITE);//前景色
    $objSheet->getStyle('A1:Z1')->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
    $objSheet->getStyle('A1:Z1')->getFill()->getStartColor()->setRGB('F93B22'); //背景色
    $objSheet->getDefaultRowDimension()->setRowHeight(28);   //单元格高
    $objSheet->freezePane('A2');//冻结表头
    $objPHPExcel->getActiveSheet()->getStyle('A')->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_LEFT);//左对齐

    //SQL
    $sql = "SELECT * FROM $down_tb WHERE make_date BETWEEN '{$start_date}' AND '{$end_date}'";
    $res = $db->getAll($sql);
    $j=2;
    foreach ($res as $key => $value) {
        if($value['miss_money']=='0'){
            $value['miss_money'] = '';
        }
        if($value['back_money']=='0'){
            $value['back_money'] = '';
        }
        if($value['back_hand_money']=='0'){
            $value['back_hand_money'] = '';
        }
        $objSheet->setCellValue("A".$j,$value['make_date'])
                ->setCellValue("B".$j,$value['make_name'])
                ->setCellValue("C".$j,$value['miss_date'])
                ->setCellValue("D".$j,$value['account'])
                ->setCellValue("E".$j,$value['luozha'])
                ->setCellValue("F".$j,$value['receive_name'])
                ->setCellValue("G".$j,$value['miss_who'])
                ->setCellValue("H".$j,$value['miss_num'])
                ->setCellValue("I".$j,$value['miss_type'])
                ->setCellValue("J".$j,$value['miss_info'])
                ->setCellValue("K".$j,$value['miss_solution'])
                ->setCellValue("L".$j,$value['miss_send'])
                ->setCellValue("M".$j,$value['miss_back'])
                ->setCellValueExplicit("N".$j,$value['miss_ems'],PHPExcel_Cell_DataType::TYPE_STRING)
                ->setCellValue("O".$j,$value['miss_money'])
                ->setCellValueExplicit("P".$j,$value['back_ems'],PHPExcel_Cell_DataType::TYPE_STRING)
                ->setCellValue("Q".$j,$value['back_money'])
                ->setCellValue("R".$j,$value['back_hand_money'])
                ->setCellValue("S".$j,$value['cost_lost'])
                ->setCellValue("T".$j,$value['all_lost'])
                ->setCellValue("U".$j,$value['back_sku'])
                ;
        $j++;
    }

    

    // $objPHPExcel->getActiveSheet()->getColumnDimension()->setAutoSize(true);
    $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
    $objWriter->save($dir."/../down/$down_tb.xlsx");   //保存在服务器
    echo "ok";
}


?>