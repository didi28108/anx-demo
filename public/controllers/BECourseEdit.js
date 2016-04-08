angular.module('myApp')

.controller('BECourseEditCtrl', function(CourseService, $scope, $http, $state, $stateParams, $window){
	$scope.$state = $state;

	// 如果無法從$stateParams取得課程_id的話就導向課程清單
	if($stateParams.course_id == null) {
		$state.go('^.course');
	}

	// loading spinner default false
	$scope.loading = {
		showSpinner: false,
		msg: "",
		success: false,
		fail: false
	};

	// 設定time picker 小時與分鐘間隔
	$scope.timePicker = {
		hstep: 1,
		mstep: 15,
		timePicker: true
	}

	// datetimepicker setup
	// start date 預設關閉與開啟function
	$scope.startDatePopup = {
		opened: false
	};
	$scope.startDateOpen = function () {
		$scope.startDatePopup.opened = true;
	};
	// end date 預設關閉與開啟function
	$scope.EndDatePopup = {
		opened: false
	};
	$scope.endDateOpen = function () {
		$scope.endDatePopup.opened = true;
	};

	// confirm date 預設關閉與開啟function
	$scope.confirmDatePopup = {
		opened: false
	};
	$scope.confirmDateOpen = function () {
		$scope.confirmDatePopup.opened = true;
	};

	// ng-ckeditor configs
	$scope.editorOptions = {
		language: 'zh',
	}

	// 取得開課單位
	CourseService.getCourseCategoryList().then(function(result) {
		$scope.categoryList = result;

	}, function(err) {
		// err handling
	});

	CourseService.getCourse($stateParams.course_id).then(function (result) {
		loadUpDataFromAnx(result);
	}, function (err) {
		// err handling ...
	});

	var loadUpDataFromAnx = function (result) {
		console.log(result);
		$scope.course = result;
		$scope.course.category = $scope.course.category._id;
		$scope.course.startDate 	= new Date(result.startDate);
		$scope.course.endDate 		= new Date(result.endDate);
		$scope.course.startTime 	= new Date(result.startDate.toString().substring(0,11)+result.startTime+":00+08:00");
		$scope.course.endTime 		= new Date(result.endDate.toString().substring(0,11)+result.endTime+":00+08:00");
		$scope.course.confirmDate	= new Date(result.confirmDate);
	}

	// 儲存對課程的編輯
	$scope.save = function () {
		// 將表單上
		// startdate, enddate, confirmdate
		// 的value格式由string轉為date
		$scope.course.startDate = new Date($scope.course.startDate.toString().replace(/\//g, "-"));
		$scope.course.endDate = new Date($scope.course.endDate.toString().replace(/\//g, "-"));
		$scope.course.confirmDate = new Date($scope.course.confirmDate.toString().replace(/\//g, "-"));
		$scope.course.enrollDueDate = new Date(dateAddDays($scope.course.confirmDate, -2));
		$scope.course.fullNo = $scope.course.year + "-" + $scope.course.no;

		CourseService.updateCourse($scope.course).then(function(result) {
			if (result.success) {
				$state.go('^.course');
			} else {
				if (result.err.code == 11000) {
					$window.alert("課程更新失敗！\n課號 " + $scope.course.fullNo + " 已被使用");
				} else {
					$window.alert("發生錯誤！\n" + result.err);
				}
			}
		}, function(err) {
			// err handling ...
		});
	}

	var dateAddDays = function (date, days) {
		date.setDate(date.getDate() + days);
		return date;
	}

	// 捨棄編輯
	$scope.cancel = function () {
		if($window.confirm("若取消編輯此課程，您的更動將不會被儲存。\n是否捨棄編輯課程？")){
			$state.go('^.course');
		}
	};


	// 課程地區清單
	$scope.areaList = [
		"基隆",
		"台北",
		"新竹",
		"苗栗",
		"台中",
		"彰化",
		"雲林",
		"嘉義",
		"台南",
		"高雄",
		"屏東",
		"宜蘭",
		"花蓮",
		"台東",
		"澎湖",
		"馬祖",
		"金門"
	];

	// 課程狀態清單
	$scope.courseStateList = ["開課", "未處理", "不開課"];

});