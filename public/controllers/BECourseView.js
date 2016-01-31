var myApp = angular.module('myApp');

myApp.controller('BECourseViewCtrl', function(CourseService, $scope, $http, $state, $stateParams){
	
	// 取得開課單位
	CourseService.getCourseCategoryList().then(function(result) {
		$scope.categoryList = result;

	}, function(err) {
		// err handling
	});


	// 用課程_id取得課程
	var getCourseReq = {
		method: 'POST',
		url: '/api/getCourse',
		data: {
			course_id: $stateParams.id
		}
	};
	$http(getCourseReq).then(function(result) {

		var course = result.data;

		// 是否供餐由boolean轉換為text(yes/no)
		var meal;
		if(course.meal_offer) {
			meal = 'yes';
		} else {
			meal = 'no';
		}

		// 日期由Date轉換為符合datepicker input的string格式
		var startdate 	= course.startdate.toString().substring(0,10).replace(/-/g, "/");
		var enddate			= course.enddate.toString().substring(0,10).replace(/-/g, "/");
		var confirmdate	= course.confirmdate.toString().substring(0,10).replace(/-/g, "/");

		// 資料塞進$scope
		$scope.category				= course.category._id;
		$scope.categoryName		= course.category.name;
		$scope.no 						= course.no;
		$scope.name						= course.name;
		$scope.startdate			= startdate;
		$scope.enddate				= enddate;
		$scope.confirmdate		= confirmdate;
		$scope.duration				= course.duration;
		$scope.time						= course.time;
		$scope.area						= course.area.name.toString();	// 地區id要特別轉換為string
		$scope.location				= course.location;
		$scope.target					= course.enroll_target;
		$scope.meal						= meal;
		$scope.price					= course.price;
		$scope.note						= course.note;
		$scope.contact				= course.contact_info;
		$scope.link						= course.enroll_link;

	});

	$scope.showCourse = function(abbr) {
		for(id in $scope.categoryList) {
			if($scope.categoryList[id].abbr == abbr) {
				$state.go('^.course', { default_category: $scope.categoryList[id] });
			}
		}
	};

});
