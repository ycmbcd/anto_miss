app.controller('showtableCtrl', ['$scope','$rootScope','$state','$stateParams','$http','$log','$modal',function($scope,$rootScope,$state,$stateParams,$http,$log,$modal){
    //查询哪个表
    $scope.tb_name = $stateParams.tb_name;
    $scope.pageSize = '10';   //每页10条
    //调用下拉组件
    $scope.plug_dropdown();

    //查询总数_分页组件
    $scope.get_count = function(){
        var s_date = document.querySelector('#s_date');
        var start_date = angular.element(s_date).val(); 
        var e_date = document.querySelector('#e_date');
        var end_date = angular.element(e_date).val();

        if($scope.click_key == "0"){    //如果没有筛选条件
            $scope.search_key_words='';
        }else{
            if($scope.search_key_words == ''){
            }
        }
        var post_data = {items_count:$scope.tb_name,start_date:start_date,end_date:end_date,field_name:$scope.click_key,search_key_words:$scope.search_key_words};
        $http.post('/fuck/table/show_table.php', post_data).success(function(data) { 
            //数据获取总数
            $scope.all_num = data;
            //分页参数
            $scope.pages = Math.ceil($scope.all_num / $scope.pageSize); //分页数
            $scope.newPages = $scope.pages > 5 ? 5 : $scope.pages;
            $scope.pageList = [];
            $scope.pageOption = [];
            $scope.selPage = 1; //默认第一页
            //默认上一页不能点
            $scope.pre_overflow = true;

            //分页要repeat的数组
            for (var i = 0; i < $scope.newPages; i++) {
                $scope.pageList.push(i + 1);
                $scope.jumpList = $scope.pageList;
            }
            if($scope.pages > 5){
                $scope.pageList.push('... '+$scope.pages); 
                $scope.jumpList = $scope.pageList;
            }

            //分页option要的数组
            for (var i = 0; i < $scope.pages; i++) {
                $scope.pageOption.push(i + 1);
            }

            //跳页
            $scope.clickOption = function(){
                if($scope.selectOption==null){
                    return false;
                }
                if($scope.selectOption <'3'){
                    $scope.pageList = $scope.jumpList;
                    $scope.selectPage($scope.selectOption);
                }else{
                    $scope.selectPage($scope.selectOption);
                }
            }

            //打印当前选中页索引
            $scope.selectPage = function (page) {

                $scope.pre_overflow = false;
                $scope.next_overflow = false;

                //判断首尾页
                if(page=="1 ..."){
                    page=1;
                    $scope.get_count();
                }else if(page=="... "+$scope.pages){
                    page=$scope.pages;
                }

                //跳页响应
                $scope.selectOption=page

                //提示到头了
                if(page < 2){
                    $scope.pre_overflow = true;
                }else if(page > $scope.pages-1){
                    $scope.next_overflow = true;
                }

                //不能小于1大于最大
                if(page<1){
                    return false;
                }else if(page > $scope.pages){
                    return false;
                }

                //最多显示分页数5 #mid状态
                if (page > 2) {
                    //因为只显示5个页数，大于2页开始分页转换
                    var newpageList = [];
                    for (var i = (page - 3) ; i < ((page + 2) > $scope.pages ? $scope.pages : (page + 2)) ; i++) {
                        newpageList.push(i + 1);
                    }
                    
                    //中间的
                    if(page > 3 && page <$scope.pages+1){
                        newpageList.unshift('1 ...');
                        newpageList.push('... '+$scope.pages);
                    }
                    //3
                    if(page == 3){
                        newpageList.push('... '+$scope.pages);
                    }
                    //p-3 末尾变
                    if(page == $scope.pages-3){
                        newpageList.pop();
                        newpageList.push($scope.pages);
                    }
                    //p-2 末尾移除
                    if(page > $scope.pages-3){
                        newpageList.pop();
                    }
                    
                    $scope.pageList = newpageList;
                    
                }
                if(page == 4){  //4开始进入mid状态
                    $scope.pageList.shift('1 ...');
                    $scope.pageList.unshift(1);
                }


                $scope.selPage = page;
                $scope.isActivePage(page);
                console.log("选择的页：" + page);
                //获取第page页数据
                $scope.to_page(page);
            };
            //设置当前选中页样式
            $scope.isActivePage = function (page) {
                return $scope.selPage == page;
            };
            //上一页
            $scope.Previous = function () {
                $scope.selectPage($scope.selPage - 1);
            }
            //下一页
            $scope.Next = function () {
                $scope.selectPage($scope.selPage + 1);
            };
        }).error(function(data) {  
            alert("系统错误，请联系管理员。");
        });         
    }

    

    //获取序列内容_分页查询
    $scope.to_page = function(page){
        //计算分页开始值
        start = (page - 1)*$scope.pageSize;

        var s_date = document.querySelector('#s_date');
        var start_date = angular.element(s_date).val(); 
        var e_date = document.querySelector('#e_date');
        var end_date = angular.element(e_date).val();

        //查询列表
        var post_data = {show_table:'miss_table',start:start,page_size:$scope.pageSize,start_date:start_date,end_date:end_date,field_name:$scope.click_key,search_key_words:$scope.search_key_words};
        $http.post('/fuck/table/show_table.php', post_data).success(function(data) {  
            $scope.show_table = data;
            // console.log(data);
        }).error(function(data) {  
            alert("系统错误，请联系管理员。");
        });           
    }

    //修改分页参数
    $scope.change_pageSize = function(){
        if($scope.change_size==null ){
            $scope.plug_alert('danger','警告，不能为空','icon-ban-circle');
            return false;
        }else{
            $scope.pageSize = $scope.change_size;   //新的分页数
            $scope.get_count();     //分配页码
            $scope.to_page('1');   //再次初始化数据
        }
    }

    $scope.get_count();     //分配页码
    $scope.to_page('1');   //初始化数据


    //查看详情
    $scope.look_info = function(e,f){
        var post_data = {look_table:e,look_info:f};
        $http.post('/fuck/table/show_table.php', post_data).success(function(data) {  
            $scope.look_item = data;
            // $log.info(data)
        }).error(function(data) {  
            alert("系统错误，请联系管理员。");
        });
    }

    //MISS下载
    $scope.down_table = function(tb_name){
        var s_date = document.querySelector('#s_date');
        var start_date = angular.element(s_date).val(); 
        var e_date = document.querySelector('#e_date');
        var end_date = angular.element(e_date).val(); 
        var post_data = {down_tb:tb_name,start_date:start_date,end_date:end_date};
        $http.post('/fuck/table/show_table.php', post_data).success(function(data) { 
            if(data=='ok'){
                window.location="/down/"+tb_name+".xlsx";
            }
        }).error(function(data) {
            alert("系统错误，请联系管理员。");
        });
    }

    //点击修改
    $scope.change_field = function(field_name,field,id,o_key){
        $scope.change_info_field_name = field_name;
        $scope.change_info_field = field;
        $scope.change_info_id = id;
        $scope.change_info_o_key = o_key;
    }

    $scope.change_item = function(e){
        var post_data = {table:$scope.tb_name,change_field:$scope.change_info_field,id:$scope.change_info_id,new_key:e};
        $http.post('/fuck/table/show_table.php', post_data).success(function(data) {  
            if(data=='ok'){
                $scope.plug_alert('success','修改完成。','icon-ok');
                var sid = $scope.change_info_field+'_'+$scope.change_info_id;
                var dom = document.querySelector('#'+sid);
                $scope.to_page($scope.selPage)
            }else if(data=='stop'){
                $scope.plug_alert('warning','此条记录不属于你。','icon-ban-circle');
            }else{
                $scope.plug_alert('danger','修改出错，请联系管理员。','icon-ban-circle');
            }
        }).error(function(data) {  
            alert("系统错误，请联系管理员。");
        });  
    }

    // 修改漏商品
    $scope.change_forget = function(id,new_forget){
        var post_data = {table:$scope.tb_name,change_field:'back_sku',id:id,new_key:new_forget};
        $http.post('/fuck/table/show_table.php', post_data).success(function(data) {  
            if(data=='ok'){
                $scope.plug_alert('success','修改完成。','icon-ok');
                $scope.look_info($scope.tb_name,id);
            }else if(data=='stop'){
                $scope.plug_alert('warning','此条记录不属于你。','icon-ban-circle');
            }else{
                $scope.plug_alert('danger','修改出错，请联系管理员。','icon-ban-circle');
            }
        }).error(function(data) {  
            alert("系统错误，请联系管理员。");
        });  
    }

    //删除弹框
    $scope.del_info = function(id){
        $scope.del_id = id;
    }

    //确定删除
    $scope.del_item = function(){
        var post_data = {del_id:$scope.del_id,table:$scope.tb_name};
        $http.post('/fuck/table/show_table.php', post_data).success(function(data) { 
            if(data=='ok'){
                $scope.plug_alert('success','删除完成。','icon-ok');
                var dom = document.querySelector('#line_'+$scope.del_id);
                angular.element(dom).remove();
            }
        }).error(function(data) {
            alert("系统错误，请联系管理员。");
        });
    }

    //查询赋值选项
    $scope.find_option = function(field){
        $http.get('/fuck/field/miss_field.php', {params:{get_choose_field:field}
        }).success(function(data) {
            $scope.field_option_info = data;
        }).error(function(data) {
            alert("系统错误，请联系管理员。");
        });
    }

}])
