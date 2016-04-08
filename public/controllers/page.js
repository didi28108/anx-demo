angular.module('myApp')

.controller('PageCtrl', function(PagesService, $scope, $state, $stateParams, $http, $window, $sce) {
	PagesService.getPage($stateParams.abbr).then(function (data) {
		if(data.notfound) {
			$state.go('anx');
		} else {
			PagesService.getPagesWithoutContent().then(function (allPages) {
				var tmp = [];
				for(index in allPages) {
					if(allPages[index].category == data.category._id) {
						tmp.push(allPages[index]);
					}
				}
				$scope.categoryList = tmp;
			});
			// load up data
			$scope.page = data;
			$scope.page.content = $sce.trustAsHtml($scope.page.content);
		}
	}, function (err) {
		// err handling ...
	});
});