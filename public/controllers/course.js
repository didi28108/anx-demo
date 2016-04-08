angular.module('myApp')

.controller('CourseCtrl', function(CourseService, $scope, $http, $state, $stateParams, $window){
	
	$scope.currentCategory = '';

	$scope.classes = ['雲科大', '政府單位'];

	$scope.sortType	= '';
	$scope.sortReverse	= false;
	$scope.searchFish = '';

	$scope.rowsPerPage = 20;

	CourseService.getCourseCategoryList().then(function(data) {
		$scope.categoryList = data;
		if($stateParams.default_category == null) {
			var categoryIndex = getIndexByCourseCategoryDeptCode($scope.categoryList, 'ANX');
			if(categoryIndex != null) {
				$scope.currentCategory = $scope.categoryList[categoryIndex];
			} else {
				$scope.currentCategory = $scope.categoryList[0];
			}
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
	$scope.showCourse = function () {
		$scope.sortType = '';
		for(id in $scope.categoryList) {
			if($scope.categoryList[id].deptCode == this.cat.deptCode) {
				$scope.currentCategory = $scope.categoryList[id];
			}
		}
	};

	function getIndexByCourseCategoryDeptCode (array, deptCode) {
		for (var i = 0; i < array.length; i++) {
			if (array[i].deptCode == deptCode) {
				return i;
			}
		}
		return null;
	}

});