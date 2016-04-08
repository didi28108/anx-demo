angular.module('myApp')

.controller('CourseViewCtrl', function(CourseService, $scope, $http, $state, $stateParams, $sce){
	$scope.classes = ['雲科大', '政府單位'];

	// 取得開課單位
	CourseService.getCourseCategoryList().then(function(result) {
		console.log(result);
		$scope.categoryList = result;
	}, function(err) {
		// err handling
	});

	// 用課程_id取得課程
	CourseService.getCourse($stateParams.id).then(function(result) {
		if (result.notfound) {
			$state.go('^.course');
		} else {
			CourseService.clicks($stateParams.id);

			$scope.course = result;
			$scope.course.startDate = $scope.course.startDate.substring(0,10);
			$scope.course.endDate = $scope.course.endDate.substring(0,10);
			$scope.course.confirmDate = $scope.course.confirmDate.substring(0,10);
			$scope.course.startTime = $scope.course.startTime;
			$scope.course.endTime = $scope.course.endTime;
			$scope.course.enrollDueDate = $scope.course.enrollDueDate.substring(0,10);
			$scope.course.remark = $sce.trustAsHtml($scope.course.remark);
		}
	}, function (err) {
		// err handling
	});

	$scope.showCourse = function(abbr) {
		for(id in $scope.categoryList) {
			if($scope.categoryList[id].abbr == abbr) {
				$state.go('^.course', { default_category: $scope.categoryList[id] });
			}
		}
	};

});
