angular.module('myApp')

.controller('CourseCtrl', function(Paginator, GuestHTTPService, $scope, $http, $state, $stateParams, $window){
	
	$scope.currentCategory = '';
	$scope.currentSubcategory = undefined;

	// $scope.classes = ['雲科大', '政府單位'];

	$scope.sortType	= '';
	$scope.sortReverse	= false;
	$scope.searchFish = '';

	$scope.rowsPerPage = 20;

	GuestHTTPService.getAllShownCourseCategory().then(function(data) {
		$scope.categoryList = data;

		if($stateParams.default_category) {
			$scope.currentSubcategory = undefined;
			$scope.currentCategory = $stateParams.default_category;
		} else {
			var categoryIndex = getIndexByCourseCategoryDeptCode($scope.categoryList, 'ANX');
			if(categoryIndex != null) {
				$scope.currentCategory = $scope.categoryList[categoryIndex];
			} else {
				$scope.currentCategory = $scope.categoryList[0];
			}
		}
	}, function(err) {
		// err handling
	});

	GuestHTTPService.getCourseSubcategoryList().then(function(data) {
		$scope.subcategoryList = data;
		// console.log($stateParams.default_subcategory);
		if($stateParams.default_subcategory) {
			$scope.currentCategory = undefined;
			$scope.currentSubcategory = $stateParams.default_subcategory;
		} else {
			// console.log("nope");
		}
	}, function(err) {
		// err handling
	});

	GuestHTTPService.getAllShownCourse().then(function(data) {
		$scope.courses = data;
	}, function(err) {
		// err handling
	});

	// show course on list when a category is clicked
	$scope.showCourse = function () {
		$scope.currentSubcategory = undefined;
		$scope.sortType = '';
		for(id in $scope.categoryList) {
			if($scope.categoryList[id].deptCode == this.cat.deptCode) {
				$scope.currentCategory = $scope.categoryList[id];
				Paginator.setPage(0);
			}
		}
	}

	$scope.subcategoryClick = function (subcategoryName) {
		$scope.currentCategory = undefined;
		$scope.currentSubcategory = subcategoryName;
	}

	function getIndexByCourseCategoryDeptCode (array, deptCode) {
		for (var i = 0; i < array.length; i++) {
			if (array[i].deptCode == deptCode) {
				return i;
			}
		}
		return null;
	}

});