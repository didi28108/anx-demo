var myApp = angular.module('myApp');

myApp.controller('BECourseCtrl', function($scope, AuthService, $http, $state, $window){
	// $scope.destroySession = function() {
	// 	AuthService.logout();
	// };
	$scope.currentCategory = '';

	$http.get('/api/getCategory').then(function(result) {
		$scope.categoryList = result.data;
		if($scope.categoryList != null) {
			$scope.currentCategory = $scope.categoryList[0];
		}
	});

	$http.get('/api/getAllCourse').then(function(result) {
		$scope.courses = course_date_transform(result.data);
	});

	function course_date_transform (courses) {
		for(id in courses) {
			console.log();
			courses[id].startdate 	= courses[id].startdate.substring(0, 10).replace(/-/g, "/");
			courses[id].enddate			= courses[id].enddate.substring(0, 10).replace(/-/g, "/");
			courses[id].confirmdate	= courses[id].confirmdate.substring(0, 10).replace(/-/g, "/");
		}
		return courses;
	};

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
		var removeCourseReq = {
			method: 'POST',
			url: 		'/api/removeCourse',
			data : {
				course_id: course_id
			}
		};
		$http(removeCourseReq).then(function(result){
			console.log('remove succeeded!');
			$state.go('backend.course', null, { reload: true });
		}, function(err) {
			// err handling ...
		});
	};

});