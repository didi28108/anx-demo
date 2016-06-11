angular.module('myApp')

.controller('BECourseEditCtrl', function(CourseService, $scope, $http, $state, $stateParams, $window, $location){
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
	$scope.endDatePopup = {
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

  // 取得課程分類的所有item
  CourseService.getCourseSubcategoryList().then(function(data) {
    $scope.subcategoryList = data;
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

	// updateCourseDataFromYT
  $scope.updateCourseDataFromYT = function () {
    if ($window.confirm("更新課程會覆蓋下方灰色區塊的所有資料\n是否確定更新？")) {
      $scope.loading.success = false;
      $scope.loading.fail = false;
      $scope.course.enrollLink = "";

      $scope.loading.showSpinner = true;
      $scope.loading.msg = "資料取得中";
      var data = {
        year: $scope.course.year,
        no: $scope.course.no
      };
      CourseService.getCourseDataFromYT(data).then(function (res) {
        if (res.success) {
          loadUpDataFromYuntech(res);
          $scope.loading.msg = "資料帶入成功";
          $scope.course.enrollLink = "https://webapp.yuntech.edu.tw/CRISWeb/Home/SignUp?courseYear="+$scope.course.year+"&courseId="+$scope.course.no;
        } else {
          $scope.loading.msg = res.msg;
        }
      }, function (err) {
        // err handling
      }).finally(function() {
        $scope.loading.showSpinner = false;
        if ($scope.loading.msg == "資料帶入成功") {
          $scope.loading.success = true;
        } else {
          $scope.loading.fail = true;
        }
      });
    }
  }

  var loadUpDataFromYuntech = function (res) {
    $scope.course.name = res.data.CourseName;
    $scope.categoryList.forEach(function (element, index, array) {
      if(element.deptCode == res.data.CourseDeptCode) {
        $scope.course.category = element._id;
      }
    });
    $scope.course.startDate     = new Date(res.data.CourseStartDate);
    $scope.course.endDate       = new Date(res.data.CourseEndDate);
    $scope.course.startTime     = new Date(res.data.CourseStartDate.substring(0,11)+res.data.CourseStartTime+":00+08:00");
    $scope.course.endTime       = new Date(res.data.CourseEndDate.substring(0,11)+res.data.CourseEndTime+":00+08:00");
    $scope.course.location      = res.data.CourseLocation;
    $scope.course.confirmDate   = new Date(res.data.CourseOfferedConfirmDate);
    $scope.course.enrollDueDate = dateAddDays(new Date(res.data.CourseOfferedConfirmDate), -2);
    $scope.course.enrollTarget  = res.data.CourseTargetStudent;
    $scope.course.launchOffer   = res.data.CourseIncludeLunch;
    $scope.course.price         = res.data.CoursePrice;
    $scope.course.maxEnroll     = res.data.MaxSignUp;
    $scope.course.state         = res.data.CourseState;
    $scope.course.remark        = res.data.CourseRemark;
    $scope.course.helpline      = res.data.CourseHelpline;
    $scope.course.state         = res.data.CourseState;
  }

	// 儲存對課程的編輯
	$scope.save = function () {
		// 將表單上
		// startdate, enddate, confirmdate
		// 的value格式由string轉為date
		// $scope.course.startDate = new Date($scope.course.startDate.toString().replace(/\//g, "-"));
		// $scope.course.endDate = new Date($scope.course.endDate.toString().replace(/\//g, "-"));
		// $scope.course.confirmDate = new Date($scope.course.confirmDate.toString().replace(/\//g, "-"));
		// $scope.course.enrollDueDate = new Date(dateAddDays($scope.course.confirmDate, -2));
		$scope.course.fullNo = $scope.course.year + "-" + $scope.course.no;

		CourseService.updateCourse($scope.course).then(function(result) {
			if (result.success) {
				$window.alert("更新成功！");
        $location.path("/backend/course/" + $scope.course._id);
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
	
});