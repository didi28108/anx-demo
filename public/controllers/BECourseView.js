angular.module('myApp')

.controller('BECourseViewCtrl', function(CourseService, $scope, $http, $state, $stateParams, $sce){
	
	$scope.classes = ['雲科大', '政府單位'];

	$scope.courseStateList = ["開課", "未處理", "不開課"];
	
	// 課程顯示或隱藏清單
	$scope.courseShowList = [
		{
			text: "顯示",
			value: true
		},
		{
			text: "隱藏",
			value: false
		}
	];

	// 課程推薦或無推薦清單
	$scope.coursePinTopList = [
		{
			text: "推薦",
			value: true
		},
		{
			text: "無",
			value: false
		}
	];

	// 取得開課單位
	CourseService.getCourseCategoryList().then(function(result) {
		$scope.categoryList = result;

	}, function(err) {
		// err handling
	});

	CourseService.getCourse($stateParams.id).then(function(result) {
		$scope.course = result;
		$scope.course.startDate = $scope.course.startDate.substring(0,10);
		$scope.course.endDate = $scope.course.endDate.substring(0,10);
		$scope.course.confirmDate = $scope.course.confirmDate.substring(0,10);
		$scope.course.enrollDueDate = $scope.course.enrollDueDate.substring(0,10);
		$scope.course.remark = $sce.trustAsHtml($scope.course.remark);
	}, function (err) {
		// err handling
	});

	$scope.showCourse = function(abbr) {
		for(id in $scope.categoryList) {
			if($scope.categoryList[id].deptName == this.cat.deptName) {
				$state.go('^.course', { default_category: $scope.categoryList[id] });
			}
		}
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
				course_id	: course_id,
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
