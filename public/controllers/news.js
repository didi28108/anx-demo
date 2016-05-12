angular.module('myApp')

.controller('NewsCtrl', function(Paginator, GuestHTTPService, NewsService, $scope, $http, $state, $stateParams, $window){

	$scope.$state = $state;

	$scope.currentCategory = '';

	$scope.sortType			= 'startdate';
	$scope.sortReverse	= true;
	$scope.searchFish		= '';

	$scope.rowsPerPage = 20;

	// 從Service取得消息公告類別
	NewsService.getNewsCategory().then(function(data) {
		$scope.categoryList = data;

		// 從Service取得所有消息公告
		GuestHTTPService.getAllShownNews().then(function(data) {
			$scope.newsList = data;

			GuestHTTPService.getShownNewsCount().then(function (data) {
				for (var i = 0; i < data.length; i++) {
					$scope.categoryList[i].shownNewsCount = data[i].shownNewsCount;
				}
			}, function(err) {
				// err handling
			});

		}, function(err) {
			// err handling
		});

		if($stateParams.default_category == null) {
			$scope.currentCategory = $scope.categoryList[0];
		} else {
			$scope.currentCategory = $stateParams.default_category;
		}
	}, function(err) {
		// err handling
	});


	// 點選類別列表上的類別時顯示該類別的消息公告在右側
	$scope.showNews = function (news_id) {
		$scope.sortType = '';
		for(id in $scope.categoryList) {
			if($scope.categoryList[id]._id == news_id) {
				$scope.currentCategory = $scope.categoryList[id];
				Paginator.setPage(0);
			}
		}
	};

});