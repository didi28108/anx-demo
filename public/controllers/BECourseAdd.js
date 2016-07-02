module.exports = (ngModule) => {

  ngModule.controller('BECourseAddCtrl', function(CourseService, $scope, $http, $state, $window){
    
    // 將目前的$state注入$scope中，供views使用
    $scope.$state = $state;

    // loading spinner default false
    $scope.loading = {
      showSpinner: false,
      msg: "",
      success: false,
      fail: false
    };

    // 設定time picker預設起始、結束時間
    var defaultDate1 = new Date("Apr 5, 2016 08:30:00");
    var defaultDate2 = new Date("Apr 5, 2016 17:00:00");
    // 設定表單預設值
    $scope.course = {
      year: 105,          // 預設年度
      startTime: defaultDate1,
      endTime: defaultDate2,
      launchOffer: "不包含",    // 預設不供餐
      area: "雲林",        // 預設雲林地區
      state: "未處理",      // 預設課程狀態
      pinTop: false,        // 預設課程推薦釘選
      show: true          // 預設課程顯示
    }

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

    // enroll due date 預設關閉與開啟function
    $scope.enrollDueDatePopup = {
      opened: false
    };
    $scope.enrollDueDateOpen = function () {
      $scope.enrollDueDatePopup.opened = true;
    };

    // ng-ckeditor configs
    $scope.editorOptions = {
      language: 'zh',
      height: 200
    }

    // 取得開課單位
    CourseService.getCourseCategoryList().then(function(result) {
      $scope.categoryList = result;
      
      // 將第一筆category資料設定為預設選項
      if($scope.categoryList != null) {
        $scope.course.category = $scope.categoryList[0]._id;
      }
    }, function(err) {
      // err handling
    });

    // 取得課程分類的所有item
    CourseService.getCourseSubcategoryList().then(function(data) {
      $scope.subcategoryList = data;
    }, function(err) {
      // err handling
    });

    $scope.getCourseDataFromYT = function () {
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

    var dateAddDays = function (date, days) {
      date.setDate(date.getDate() + days);
      return date;
    }

    $scope.add = function () {
      // 將表單上
      // startdate, enddate, confirmdate
      // 的value格式由string轉為date
      // $scope.course.startDate = new Date($scope.course.startDate.toString().replace(/\//g, "-"));
      // $scope.course.endDate = new Date($scope.course.endDate.toString().replace(/\//g, "-"));
      // $scope.course.confirmDate = new Date($scope.course.confirmDate.toString().replace(/\//g, "-"));
      // $scope.course.enrollDueDate = new Date(dateAddDays($scope.course.confirmDate, -2));
      $scope.course.fullNo = $scope.course.year + "-" + $scope.course.no;

      CourseService.addCourse($scope.course).then(function(result) {
        if (result.success) {
          $state.go('^.course');
        } else {
          if (result.err.code == 11000) {
            $window.alert("課程新增失敗！\n課號 " + $scope.course.fullNo + " 已被使用");
          } else {
            $window.alert("發生錯誤！\n" + result.err.msg);
            console.log(result);
          }
        }
      }, function(err) {
        // err handling
      });
    };

    var dateAddDays = function (date, days) {
      date.setDate(date.getDate() + days);
      return date;
    }

    $scope.test = function () {
      console.log($scope.areaList.options[$scope.area].id, $scope.areaList.options[$scope.area].name);
    };

    $scope.cancel = function () {
      if($window.confirm("是否放棄新增課程？")){
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

  });

}