angular.module('myApp')

.controller('CourseCtrl', function(CourseService, $scope, $http, $state, $stateParams, $window){
	
	$scope.currentCategory = '';

	$scope.sortType			= '';
	$scope.sortReverse	= false;
	$scope.searchFish		= '';

	CourseService.getCourseCategoryList().then(function(data) {
		$scope.categoryList = data;
		if($stateParams.default_category == null) {
			console.log($scope.categoryList);
			$scope.currentCategory = $scope.categoryList[0];
		} else {
			$scope.currentCategory = $stateParams.default_category;
		}
	}, function(err) {
		// err handling
	});

	CourseService.getAllCourse().then(function(data) {
		$scope.courses = data;
	}, function(err) {
		// err handling
	});


	// show course on list when a category is clicked
	$scope.showCourse = function (abbr) {
		$scope.sortType = '';
		for(id in $scope.categoryList) {
			if($scope.categoryList[id].abbr == abbr) {
				$scope.currentCategory = $scope.categoryList[id];
			}
		}
	};

});