var myApp = angular.module('myApp', ['ui.router','ui.bootstrap','ngAnimate','mgcrea.ngStrap']);
//由于整个应用都会和路由打交道，所以这里把$state和$stateParams这两个对象放到$rootScope上，方便其它地方引用和注入。
myApp.run(function($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

    //跳转开始
    $rootScope.$on('$stateChangeStart',function(){ 
    	document.getElementById('info1').innerHTML='等待响应';
    	document.getElementById('info2').innerHTML='等待响应';
    })
    //跳转成功执行
    $rootScope.$on('$stateChangeSuccess',function(){ 
    	document.getElementById('info1').innerHTML='跳转完成！';
    })
    //跳转失败执行（可能没有找到模板）
    $rootScope.$on('$stateChangeError',function(){
    	document.getElementById('info1').innerHTML='跳转错误！';
    })
    //跳转没有找到（可能没有声明state）
    $rootScope.$on('$stateNotFound',function(){
    	document.getElementById('info1').innerHTML='跳转没有找到！';
    })

    //视图加载中
    $rootScope.$on('$viewContentLoading',function(){
    	document.getElementById('info2').innerHTML='视图...ing';
    });
    //视图加载完成
    $rootScope.$on('$viewContentLoaded',function(){
    	document.getElementById('info2').innerHTML='视图...ok';
    	
    });
});
//日期绑定
myApp.directive('layDate', function() {
    return {
        require: '?ngModel',
        restrict : 'A',
        scope:{
            ngModel: '='
        },
        link : function(scope, element, attr,ngModel) {
            // Specify how UI should be updated
            ngModel.$render = function() {
              element.val(ngModel.$viewValue || '');
            };
            // Listen for change events to enable binding
            element.on('blur keyup change', function() {
              scope.$apply(read);
            });
            read(); // initialize
            // Write data to the model
            function read() {
              var val = element.val();
              ngModel.$setViewValue(val);
            }
            if (attr.skin)
                laydate.skin(attr.skin);
            laydate({
                elem : '#' + attr.id,
                format:attr.format!=undefined&&attr.format!=''?attr.format:'YYYY-MM-DD',
                istime:attr.istime,
                choose:function(data){
                    scope.$apply(read);
                }
            });
        }
    }
});
//为post而设
myApp.config(function($httpProvider){
    $httpProvider.defaults.transformRequest=function(obj){
        var str=[];
        for(var p in obj){
            str.push(encodeURIComponent(p)+"="+encodeURIComponent(obj[p]));
        }
        return str.join("&");
    };
    $httpProvider.defaults.headers.post={'Content-Type':'application/x-www-form-urlencoded'}      
})

myApp.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/login');	//重定向
    $stateProvider
    	.state('login', {
            url: '/login',
            data : { pageTitle: '登陆' },
            templateUrl: 'tpls/login.html'
        })

        .state('site', {
            url: '/site',
            data : { pageTitle: 'ANTO-MISS' },
            views: {
                '': {
                    templateUrl: 'tpls/site.html'
                },
                'topbar@site': {
                    templateUrl: 'tpls/topbar.html'
                }
            }
        })

        //新建miss
        .state('site.addmiss',{
            url: '/addmiss/{data}',
            views:{
                'show@site':{
                    templateUrl: 'tpls/miss/addmiss.html'
                }
            }
        })
        //miss表
        .state('site.misstable',{
            url: '/misstable/{data}',
            params : { tb_name: 'miss_table'},
            views:{
                'show@site':{
                    templateUrl: 'tpls/miss/misstable.html'
                }
            }
        })
     
        //账号管理
        .state('site.sysuser',{
            url: '/sysuser/{data}',
            views:{
                'show@site':{
                    templateUrl: 'tpls/sysconf/sysuser.html'
                }
            }
        })

        //密码修改
        .state('site.syspwd',{
            url: '/syspwd/{data}',
            views:{
                'show@site':{
                    templateUrl: 'tpls/sysconf/syspwd.html'
                }
            }
        })

        .state('page', {
            url: '/page/{show}',
           	data : { pageTitle: 'page页' },
            views: {
                '': {
                    templateUrl: 'tpls/site.html'
                },
                'show@page': {
                	templateUrl: function($stateParams){
                		return 'tpls/pages/'+$stateParams.show+'.html';
                	}
     //                ,
	    //             controller: function($scope){
				 //    	$scope.innertxt = '内部传参';
					// }
            	},
                'sidebar@page': {
                    templateUrl: 'tpls/sidebar.html'
                }
            },
   //          onEnter: function(){ 		//进入后的触发状态、退出：onExit
			//     alert(1)
			// },
        })

        .state('text', {
            url: '/text',
            views: {
                '': {
                	template: '<h2>一段html</h2>',

                }
            },
            controller: function($scope){
			    $scope.title = '加载一段HTML';
			}
        })
});

//页头
myApp.directive('title', ['$rootScope', '$timeout',
  function($rootScope, $timeout) {
    return {
      link: function() {

        var listener = function(event, toState) {

          $timeout(function() {
            $rootScope.title = (toState.data && toState.data.pageTitle) 
            ? toState.data.pageTitle 
            : '默认站名';	//默认title
          });
        };

        $rootScope.$on('$stateChangeSuccess', listener);
      }
    };
  }
]);

//回车
myApp.directive('ngEnter', function () {
      return function (scope, element, attrs) {
          element.bind("keypress", function (event) {
              if (event.which === 13) {
                  scope.$apply(function () {
                      scope.$eval(attrs.ngEnter);
                  });
                  event.preventDefault();
              }
          });
      };
  });

myApp.directive('focusMe', ['$timeout', '$parse', function ($timeout, $parse) {
    return {
        //scope: true,   // optionally create a child scope
        link: function (scope, element, attrs) {
            var model = $parse(attrs.focusMe);
            scope.$watch(model, function (value) {
                // console.log('value=', value);
                if (value === true) {
                    $timeout(function () {
                        element[0].focus();
                    });
                }
            });
            // to address @blesh's comment, set attribute value to 'false'
            // on blur event:
            element.bind('blur', function () {
                console.log('blur');
                scope.$apply(model.assign(scope, false));
            });
        }
    };
}]);
