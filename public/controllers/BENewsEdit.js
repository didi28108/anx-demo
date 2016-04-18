angular.module('myApp')

.controller('BENewsEditCtrl', function(NewsService, $scope, $http, $state, $stateParams, $window){

	$scope.$state = $state;
	
	$scope.newsShowList = [
		{
			text: "顯示",
			value: true
		},
		{
			text: "隱藏",
			value: false
		}
	];

	$scope.news = {};

	// datetimepicker setup
	// start date 預設關閉與開啟function
	$scope.startDatePopup = {
		opened: false
	};
	$scope.startDateOpen = function () {
		$scope.startDatePopup.opened = true;
	};
	// end date 預設關閉與開啟function
	$scope.endDatePopup = {
		opened: false
	};
	$scope.endDateOpen = function () {
		$scope.endDatePopup.opened = true;
	};

	if($stateParams.news_id == null) {
		$state.go('^.news');
	}

	NewsService.getNewsCategory().then(function(data) {
		$scope.categoryList = data;
	}, function(err) {
		// err handling
	});

	NewsService.getNews($stateParams.news_id).then(function(data) {
		$scope.news._id 		= data._id;
		$scope.news.title 		= data.title;
		$scope.news.content		= data.content;
		$scope.news.show		= data.show;
		$scope.news.category	= data.category._id;
	}, function(err) {
		// err handling ...
	});

	$scope.cancel = function () {
		if($window.confirm("若取消編輯此公告，您的更動將不會被儲存。\n是否捨棄編輯公告？")){
			$state.go('^.news');
		}
	}

	$scope.save = function () {
		NewsService.updateNews($scope.news).then(function(data) {
			$window.alert("更新成功！");
			$state.go('^.news');
		}, function(err) {
			// err handling ...
		});
	}

});