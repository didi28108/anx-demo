angular.module('myApp')

.controller('NewsViewCtrl', function(NewsService, $scope, $http, $state, $stateParams, $sce){
	
	NewsService.getNewsCategory().then(function(data) {
		$scope.categoryList = data;
	}, function(err) {
		// err handling
	});

	NewsService.getNews($stateParams.id).then(function(data) {
		if(data.notfound) {
			$state.go('^.news');
		} else {
			NewsService.clicks(data._id);
			$scope.news	= data;
			$scope.news.content = $sce.trustAsHtml($scope.news.content);
		}
	});


	
	$scope.showNews = function (news_id) {
		for(id in $scope.categoryList) {
			if($scope.categoryList[id]._id == news_id) {
				$state.go('^.news', { default_category: $scope.categoryList[id] });
			}
		}
	};

});
