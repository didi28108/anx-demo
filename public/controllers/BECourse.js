var myApp = angular.module('myApp');

myApp.controller('BECourseCtrl', function(CourseService, $scope, $http, $state, $stateParams, $window){
	
	$scope.currentCategory = '';

	CourseService.getCourseCategoryList().then(function(data) {
		$scope.categoryList = data;
		if($stateParams.default_category == null) {
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
		for(id in $scope.categoryList) {
			if($scope.categoryList[id].abbr == abbr) {
				$scope.currentCategory = $scope.categoryList[id];
			}
		}
	};

	$scope.goAdd = function() {
		$state.go('^.addCourse');
	};

	/* course list options */
	// edit course
	$scope.goEdit = function() {
		$state.go('^.editCourse', { course_id: this.course._id });
	};

	$scope.delete = function() {
		var course_id = this.course._id;
		var category_id = this.course.category._id;
		if($window.confirm("被刪除的課程無法被復原\n是否確定要刪除此課程？")){
			var data = {
				course_id		: course_id,
				category_id	: category_id
			}
			CourseService.removeCourse(data).then(function(result){
				console.log('remove succeeded!');
				$state.go('backend.course', null, { reload: true });
			}, function(err) {
				// err handling ...
			});
		}
	};

});