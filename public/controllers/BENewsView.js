var myApp = angular.module('myApp');

myApp.controller('BENewsViewCtrl', function(NewsService, $scope, $http, $state, $stateParams){
	
	NewsService.getNewsCategory().then(function(data) {
		$scope.categoryList = data;
	}, function(err) {
		// err handling
	});

	NewsService.getNews($stateParams.id).then(function(data) {
		console.log(data);
		$scope.title			= data.title;
		$scope.content		= data.content;
		$scope.startdate	= data.startdate;
		$scope.enddate		= data.enddate;
		$scope.category 	= data.category;
	});


	
	$scope.showNews = function (news_id) {
		for(id in $scope.categoryList) {
			if($scope.categoryList[id]._id == news_id) {
				$state.go('^.news', { default_category: $scope.categoryList[id] });
			}
		}
	};

});
