var app=angular.module('myApp');
app.controller('addmissCtrl', ['$scope','$state','$http','$log', function($scope,$state,$http,$log){
//新建商品

    //跳转下一条
    $scope.next_add = function(){
        var time=new Date().getTime();
        $state.go('site.addmiss',{},{reload:true});
    }

    //去掉前后空格
    $scope.trim = function(str){
        return str.replace(/(^\s*)|(\s*$)/g, "");
    }

    //快速赋值
    $scope.fuzhi = function(e,f){
        $scope[e] = f;
        $scope.remove_option();
    };

    //查询赋值选项
    $scope.find_option = function(field){
        $scope.remove_option();
        $http.get('/fuck/field/miss_field.php', {params:{get_choose_field:field}
        }).success(function(data) {
            $scope.field_option = data;
            var dom = document.querySelector('#fz_'+field);
                var fuzhi = document.querySelectorAll('.fuzhi');
                angular.element(fuzhi).addClass('hidden');
                angular.element(dom).removeClass('hidden');
        }).error(function(data) {
            alert("系统错误，请联系管理员。");
        });
    }
    $scope.remove_option = function(){
        //鼠标离开隐藏
        var fuzhi = document.querySelectorAll('.fuzhi');
            angular.element(fuzhi).addClass('hidden');
    }

    //选项管理
    $scope.miss_choose = function(e,f){
        $scope.miss_choose_title = e;
        $scope.miss_choose_field = f;
        //请求miss选项
        $http.get('/fuck/field/miss_field.php', {params:{get_choose_field:$scope.miss_choose_field}
        }).success(function(data) {
            $scope.miss_choose_items = data;
        }).error(function(data) {
            alert("系统错误，请联系管理员。");
        });
    }

    //新建miss选项
    $scope.add_miss_choose = function(e){
        $http.get('/fuck/field/miss_field.php', {params:{new_miss_choose_field:$scope.miss_choose_field,new_field_name:e}
        }).success(function(data) {
            if(data=="ok"){
                $scope.plug_alert('success','添加完成。','icon-ok');
                $scope.miss_choose('',$scope.miss_choose_field);
            }else if(data=="has"){
                $scope.plug_alert('danger','已存在。','icon-ban-circle');  
            }else{
                $scope.plug_alert('danger','添加失败。','icon-ban-circle');  
            }
        }).error(function(data) {
            alert("系统错误，请联系管理员。");
        });
    }

    //删除miss选项
    $scope.del_miss_choose = function(e){
        $http.get('/fuck/field/miss_field.php', {params:{del_miss_choose:e}
        }).success(function(data) {
            if(data=="ok"){
                $scope.plug_alert('success','删除完成。','icon-ok');
                var dom = document.querySelectorAll('.field_'+e);
                angular.element(dom).remove();  //移除
            }else{
                $scope.plug_alert('danger','删除失败。','icon-ban-circle');  
            }
        }).error(function(data) {
            alert("系统错误，请联系管理员。");
        });
    }

    //新建MISS
    $scope.submit_miss = function(){  
        // $log.info($scope.u_name);
        // $log.info($scope.date_today);
        // $log.info($scope.missdate);
        // $log.info($scope.account);
        // $log.info($scope.luozha);
        // $log.info($scope.receive_name);
        // $log.info($scope.miss_who);
        // $log.info($scope.miss_num);
        // $log.info($scope.miss_type);
        // $log.info($scope.miss_info);
        // $log.info($scope.miss_solution);
        // $log.info($scope.miss_send);
        // $log.info($scope.miss_back);
        // $log.info($scope.miss_ems);
        // $log.info($scope.miss_money);
        // $log.info($scope.back_ems);
        // $log.info($scope.back_money);
        // $log.info($scope.back_hand_money);
        // $log.info($scope.back_sku);

        var post_data = {
            add_miss:'add',
            u_name:$scope.u_name,
            date_today:$scope.date_today,
            missdate:$scope.missdate,
            account:$scope.account,
            luozha:$scope.luozha,
            receive_name:$scope.receive_name,
            miss_who:$scope.miss_who,
            miss_num:$scope.miss_num,
            miss_type:$scope.miss_type,
            miss_info:$scope.miss_info,
            miss_solution:$scope.miss_solution,
            miss_send:$scope.miss_send,
            miss_back:$scope.miss_back,
            miss_ems:$scope.miss_ems,
            miss_money:$scope.miss_money,
            back_ems:$scope.back_ems,
            back_money:$scope.back_money,
            back_hand_money:$scope.back_hand_money,
            back_sku:$scope.back_sku,
            cost_lost:$scope.cost_lost
        };
        $http.post('/fuck/goods/add_goods.php', post_data).success(function(data) {  
            if(data=='ok'){
                $scope.plug_alert('success','记录完成。','icon-ok');
                $scope.miss_over = true;
            }else{
                $log.info(data);
                $scope.plug_alert('danger','添加失败。','icon-ban-circle');
            }
        }).error(function(data) {  
            alert("系统错误，请联系管理员。") 
        }); 
    }

}])

app.controller('delgoodsCtrl', ['$scope','$state','$http', function($scope,$state,$http){
    //重命名
    $scope.rename_popover = {
        title: '表单重命名',
        templateUrl: 'rename_popover.html'
    };
    //删除
    $scope.del_popover = {
        title: '删除 ?',
        templateUrl: 'del_popover.html'
    };

    //table_key
    $scope.table_key = function(e){
        $scope.table_key_click = e;
    }

    $scope.look_sku = function(){
        if($scope.user_sku==''){
            return false;
        }
        $http.get('/fuck/goods/del_goods.php', {params:{user_sku:$scope.user_sku}
        }).success(function(data) {
            $scope.del_goods = data;
        }).error(function(data) {
            alert("系统错误，请联系管理员。");
        });
    }

    //重命名
    $scope.rename_sku = function(){
        if($scope.rename_popover.re_sku==undefined || $scope.rename_popover.re_sku==''){
            return false;
        }else{
            $http.get('/fuck/goods/del_goods.php', {params:{re_sku:$scope.rename_popover.re_sku,re_id:$scope.table_key_click}
            }).success(function(data) {
                if(data=="ok"){
                    $scope.plug_alert('success',$scope.rename_popover.re_sku+'重命名完成。','icon-ok');
                    var dom = document.querySelector('.popover');
                    angular.element(dom).removeClass('in');  //移除popover
                    $scope.rename_popover.re_sku = '';
                    $scope.look_sku();
                }else if(data=='has'){
                    $scope.plug_alert('danger','已存在该 SKU。','icon-ban-circle');
                }else{
                    $scope.plug_alert('danger','系统错误，请联系管理员。','icon-ban-circle');
                }
            }).error(function(data) {
                alert("系统错误，请联系管理员。");
            });
        }
    }

    //删除
    $scope.del_sku = function(){
        $http.get('/fuck/goods/del_goods.php', {params:{del_sku:$scope.table_key_click}
        }).success(function(data) {
            if(data=="ok"){
                $scope.plug_alert('success','删除完成。','icon-ok');
                var dom = document.querySelector('.popover');
                angular.element(dom).removeClass('in');  //移除popover
                $scope.rename_popover.re_sku = '';
                $scope.look_sku();
            }else{
                $scope.plug_alert('danger','系统错误，请联系管理员。','icon-ban-circle');
            }
        }).error(function(data) {
            alert("系统错误，请联系管理员。");
        });
    }
}])