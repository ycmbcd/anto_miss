var app=angular.module('myApp');
//登陆控制器
app.controller('loginCtrl', ['$rootScope','$scope','$state','$http',function ($rootScope,$scope,$state,$http) {
    $rootScope.bg = true;   //设置背景
    $scope.focus_me = true;

    $rootScope.jp_lang = 0;
    $scope.cg_lang = function(){
        if($scope.jp_lang == 0){
            $scope.jp_lang = 0;
        }else{
            $scope.jp_lang = 1;
        }
    }

    $scope.save = function(){
        var post_data = {u_num:$scope.u_num,u_pwd:$scope.u_pwd,u_lang:$scope.jp_lang};
        if($scope.loginForm.$valid){
            $http.post('/fuck/login.php', post_data).success(function(data) {  
                console.log(data)
                if(data=='go'){
                    $rootScope.jp_lang = $scope.jp_lang;
                    $state.go('site');  //跳转到main
                }else{
                    alert('用户名或密码不正确'); //%
                }
            }).error(function(data) {  
                alert("系统错误，请联系管理员。")   // %
            });  
        }else{
            alert("表单验证失败") // %
        }
    }
}])

//密码修改
app.controller('repwdCtrl', ['$rootScope','$scope','$state','$http',function ($rootScope,$scope,$state,$http) {
    $scope.cg_pwd = function(){
        var post_data = {change_pwd:$scope.old_pwd,new_pwd:$scope.new_pwd,re_pwd:$scope.re_pwd};
        $http.post('/fuck/login.php', post_data).success(function(data) {  
            if(data=='ok'){
                alert('密码修改完成，请重新登录。');
                window.location='/fuck/login.php?logout';
            }else{
                $scope.plug_alert('danger','输入有误。','icon-ban-circle');
            }
        }).error(function(data) {  
            alert("系统错误，请联系管理员。") 
        }); 
    }
}])

//账号管理
app.controller('userCtrl', ['$scope','$state','$http',function ($scope,$state,$http) {
    $scope.show_users = function(){
        var post_data = {show_users:'show'};
        $http.post('/fuck/login.php', post_data).success(function(data) {  
            $scope.all_users = data;
        }).error(function(data) {  
            alert("系统错误，请联系管理员。") 
        }); 
    }
    $scope.show_users();

    //添加员工
    $scope.add_user = function(){
        var post_data = {add_user:$scope.new_user};
        $http.post('/fuck/login.php', post_data).success(function(data) {  
            if(data=='ok'){
                $scope.plug_alert('success','添加完成。','icon-ok');
                $scope.show_users();
                $scope.new_user = '';
            }else if(data=='has'){
                $scope.plug_alert('danger','已存在。','icon-ban-circle');
            }else{
                $scope.plug_alert('danger','输入有误。','icon-ban-circle');
            }
        }).error(function(data) {  
            alert("系统错误，请联系管理员。") 
        }); 
    }

    //删除员工
    $scope.del_user_info = function(u_num){
        $scope.del_u_num = u_num;
    }

    //确定删除
    $scope.del_user = function(){
        var post_data = {del_user:$scope.del_u_num};
        $http.post('/fuck/login.php', post_data).success(function(data) { 
            if(data=='ok'){
                $scope.plug_alert('success','删除完成。','icon-ok');
                $scope.show_users();
            }
        }).error(function(data) {
            alert("系统错误，请联系管理员。");
        });
    }
}])

//面板控制器
app.controller('siteCtrl', ['$rootScope','$scope','$state','$http', function($rootScope,$scope,$state,$http){
    
    $rootScope.bg = false;

    //查询u_name
    $http.get('/fuck/login.php', {params:{u_name:"get"}
    }).success(function(data) {
        if(data=="logout"){
            $state.go('login');  //跳转到首页登录，%添加超时提醒
        }else{
            $scope.u_name = data;
            if(data=='管理员'){
                $scope.is_admin = 1;
            }
        }
    }).error(function(data) {
        alert("系统错误，请联系管理员。");
    });

    //查询今天日期
    $http.get('/fuck/login.php', {params:{date_today:"get"}
    }).success(function(data) {
        $scope.date_today = data;
    }).error(function(data) {
        alert("日期获取错误，请联系管理员。");
    });

    //nav切换
    $scope.nav_click = function(e){

        if(e=='1'){
            $scope.is_click1 = true;
            $scope.is_click2 = false;
            $scope.is_click3 = false;
            $scope.is_click4 = false;
        }
        if(e=='2'){
            $scope.is_click2 = true;
            $scope.is_click1 = false;
            $scope.is_click3 = false;
            $scope.is_click4 = false;
        }
        if(e=='3'){
            $scope.is_click3 = true;
            $scope.is_click1 = false;
            $scope.is_click2 = false;
            $scope.is_click4 = false;
        }
        if(e=='4'){
            $scope.is_click4 = true;
            $scope.is_click1 = false;
            $scope.is_click2 = false;
            $scope.is_click3 = false;
        }
    }
}])