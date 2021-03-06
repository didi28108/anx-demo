module.exports = (ngModule) => {

  ngModule.controller('BECourseViewCtrl', function(CourseService, $scope, $http, $state, $stateParams, $sce, $window){
    
    /*  後台瀏覽課程controller
     *  template: views/backend-course-view.html
     *  主要功能:
     *    - 瀏覽課程資料
     *    - 前往編輯、刪除、更新課程狀態、更新推薦狀態、更新顯示狀態
     */

    // $scope.classes = ['雲科大', '政府單位'];

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

    // 取得課程
    CourseService.getCourse($stateParams.id).then(function(result) {
      $scope.course = result;

      $scope.course.startDate     = new Date($scope.course.startDate).toLocaleDateString().replace(/-/g, "/");
      $scope.course.endDate       = new Date($scope.course.endDate).toLocaleDateString().replace(/-/g, "/");
      $scope.course.confirmDate   = new Date($scope.course.confirmDate).toLocaleDateString().replace(/-/g, "/");
      $scope.course.enrollDueDate = new Date($scope.course.enrollDueDate).toLocaleDateString().replace(/-/g, "/");
      $scope.course.remark        = $sce.trustAsHtml($scope.course.remark);
      $scope.course.goal          = $sce.trustAsHtml($scope.course.goal);
      $scope.course.info          = $sce.trustAsHtml($scope.course.info);
      $scope.course.lecturerInfo  = $sce.trustAsHtml($scope.course.lecturerInfo);
    }, function (err) {
      // err handling
    });

    // go edit course
    $scope.goEdit = function() {
      $state.go('^.editCourse', { course_id: this.course._id });
    };

    // delete course
    $scope.delete = function() {
      var course_id = this.course._id;
      var category_id = this.course.category._id;
      if($window.confirm("被刪除的課程無法被復原\n是否確定要刪除此課程？")){
        var data = {
          course_id  : course_id,
          category_id  : category_id
        }
        CourseService.removeCourse(data).then(function(result){
          console.log('remove succeeded!');
          $state.go('backend.course', null, { reload: true });
        }, function(err) {
          // err handling ...
        });
      }
    };

    // 更新課程開課狀態
    $scope.stateChanged = function () {
      var fullNo = this.course.fullNo;
      var name = this.course.name;

      var course = {
        _id: this.course._id,
        state: this.course.state
      }

      CourseService.updateCourseState(course).then(function (result) {
        if (result.nModified) {
          $window.alert("更新成功！\n\n課號: 「 " + fullNo + " 」  課程名稱: 「" + name + " 」\n之課程狀態已更新為「 " + course.state + " 」");
        } else {
          $window.alert("發生錯誤，請再試一次！");
        }
      });
    }

    // 更新課程推薦狀態
    $scope.pinTopChanged = function () {
      var fullNo = this.course.fullNo;
      var name = this.course.name;

      var course = {
        _id: this.course._id,
        pinTop: this.course.pinTop
      }

      CourseService.pinTop(course).then(function (result) {
        console.log(result);
        if (result.nModified) {
          var msg = course.pinTop ? "已改為推薦課程" : "已更改為無推薦";

          $window.alert("更新成功！\n\n課號: 「 " + fullNo + " 」  課程名稱: 「" + name + " 」\n" + msg);
        } else {
          $window.alert("發生錯誤，請再試一次！");
        }
      });
    }

    // 更新課程顯示狀態
    $scope.showChanged = function () {
      var fullNo = this.course.fullNo;
      var name = this.course.name;
      var course = {
        _id: this.course._id,
        show: this.course.show
      }

      CourseService.setShow(course).then(function(result) {
        console.log(result);
        if (result.nModified) {
          var msg = course.show ? "已更改為顯示" : "已更改為隱藏";

          $window.alert("更新成功！\n\n課號: 「 " + fullNo + " 」  課程名稱: 「" + name + " 」\n" + msg);
        } else {
          $window.alert("發生錯誤，請再試一次！");
        }
      });
    }

  });

}