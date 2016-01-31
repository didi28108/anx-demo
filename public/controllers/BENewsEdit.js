var myApp = angular.module('myApp');

myApp.controller('BENewsEditCtrl', function(NewsService, $scope, $http, $state, $stateParams, $window){

	$scope.$state = $state;

	if($stateParams.news_id == null) {
		$state.go('^.news');
	}

	NewsService.getNewsCategory().then(function(data) {
		$scope.categoryList = data;
	}, function(err) {
		// err handling
	});

	NewsService.getNews($stateParams.news_id).then(function(data) {
		$scope.title 			= data.title;
		$scope.content		= data.content;
		$scope.startdate	= data.startdate;
		$scope.enddate		= data.enddate;
		$scope.category 	= data.category;
	}, function(err) {
		// err handling ...
	});

	$scope.cancel = function () {
		if($window.confirm("若取消編輯此公告，您的更動將不會被儲存。\n是否捨棄編輯公告？")){
			$state.go('^.news');
		}
	}

	$scope.save = function () {
		var updatedNews = {
			news_id		: $stateParams.news_id,
			title			: $scope.title,
			content		: $scope.content,
			startdate	: $scope.startdate,
			enddate		: $scope.enddate,
			category 	: $scope.category
			// pintotop 	: $scope.pintotop,
		};
		NewsService.updateNews(updatedNews).then(function(data) {
			$state.go('^.news');
		}, function(err) {
			// err handling ...
		});
	}

});