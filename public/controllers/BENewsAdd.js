angular.module('myApp')

.controller('BENewsAddCtrl', function(NewsService, $scope, $http, $state, $stateParams, $window){

	$scope.$state = $state;

	console.log('$stateParams.default_category: ', $stateParams.default_category);
	
	NewsService.getNewsCategory().then(function(data) {
		$scope.categoryList = data;
		if($scope.categoryList != null) {
			$scope.category = $scope.categoryList[0]._id;
		}
	}, function(err) {
		// err handling
	});

	$scope.add = function () {
		var newNews = {
			title			: $scope.title,
			content		: $scope.content,
			startdate	: $scope.startdate,
			enddate		: $scope.enddate,
			category 	: $scope.category
			// pintotop 	: $scope.pintotop,
		};
		NewsService.addNews(newNews).then(function(data) {
			$state.go('^.news');
		}, function(err) {
			// err handling ... 
		});
	};

	$scope.cancel = function () {
		if($window.confirm("若取消編輯此公告，您的更動將不會被儲存。\n是否捨棄編輯公告？")){
			$state.go('^.news');
		}
	};


});