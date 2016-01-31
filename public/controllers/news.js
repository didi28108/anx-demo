var myApp = angular.module('myApp');

myApp.controller('NewsCtrl', function(NewsService, $scope, $http, $state, $stateParams, $window){

	$scope.$state = $state;

	$scope.currentCategory = '';

	// 從Service取得消息公告類別
	NewsService.getNewsCategory().then(function(data) {
		$scope.categoryList = data;
		if($stateParams.default_category == null) {
			$scope.currentCategory = $scope.categoryList[0];
		} else {
			$scope.currentCategory = $stateParams.default_category;
		}
	}, function(err) {
		// err handling
	});

	// 從Service取得所有消息公告
	NewsService.getAllNews().then(function(data) {
		$scope.newsList = data;
	}, function(err) {
		// err handling
	});

	// 點選類別列表上的類別時顯示該類別的消息公告在右側
	$scope.showNews = function (news_id) {
		for(id in $scope.categoryList) {
			if($scope.categoryList[id]._id == news_id) {
				$scope.currentCategory = $scope.categoryList[id];
			}
		}
	};


});