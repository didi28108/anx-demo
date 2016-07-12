module.exports = (ngModule) => {

  ngModule.controller('BECourseCtrl', function(CourseService, $scope, $http, $state, $stateParams, $window) {

    /*  後台課程管理controller
     *  template: views/backend-course.html
     *  主要功能:
     *    - 課程管理區塊: 以列表呈現課程，可更改狀態、推薦、顯示，或進一步編輯、刪除
     *    - 課程單位(即課程類別)管理區塊: 增刪改課程單位
     *    - 課程分類(即課程子類別)管理區塊: 增刪改課程子類別
     */

    $scope.showCourseManageSection = true;        // 預設"顯示"課程管理區塊
    $scope.showCategoryManageSection = false;     // 預設"隱藏"課程單位管理區塊
    $scope.showSubcategoryManageSection = false;  // 預設"隱藏"課程分類管理區塊

    // 用state parameters切換管理模式
    if($stateParams.manageMode) {
      manageModeSwitcher($stateParams.manageMode);
    }

    $scope.showAddCategoryBtn = true;         // 預設顯示新增課程單位
    $scope.addSubcategoryFormVisible = true;  // 預設顯示新增課程分類的按鈕
    $scope.panelTitle = "新增單位";           // 預設單位管理表單標題為"新增單位"
    document.getElementById('categoryPanel').classList.add('panel-info');   // 預設單位管理表單樣式

    // 校內單位或政府單位(目前不使用)
    // $scope.classes = ["雲科大", "政府單位"];

    // 課程狀態預設值
    $scope.courseStateList = ["開課", "未處理", "不開課"];    

    // 課程推薦釘選清單
    $scope.coursePinTopList = [
      {
        value: false,
        text: "無"
      },
      {
        value: true,
        text: "推薦"
      }
    ];

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

    // 課程單位管理表單預設值
    $scope.categoryFormData = {
      deptName: "",
      deptCode: "",
      show: true
    };

    $scope.currentCategory = '';
    $scope.currentSubcategory = undefined;

    $scope.sortType = '';
    $scope.sortReverse = false;
    $scope.searchFish = '';

    // 取得課程單位
    CourseService.getCourseCategoryList().then(function(data) {
      $scope.categoryList = data;
      if($stateParams.default_category == null) {
        setCurrentCategoryAsDefault();
      } else {
        $scope.currentCategory = $stateParams.default_category;
      }
    }, function(err) {
      // err handling
    });

    // give currentCategory a category as default value
    var setCurrentCategoryAsDefault = function() {
      $scope.categoryList.map(function(e, i) {
        if(e.deptCode == 'ANX') {
          $scope.currentCategory = e;
        }
      });
      if(!$scope.currentCategory) {
        $scope.currentCategory = $scope.categoryList[0];
      }
    }

    // 取得課程分類
    CourseService.getCourseSubcategoryList().then(function(data) {
      $scope.subcategoryList = data;
    }, function(err) {
      // err handling
    });

    CourseService.getAllCourse().then(function(data) {
      $scope.courses = data;
    }, function(err) {
      // err handling
    });

    // 切換管理模式
    $scope.switchManageMode = function (args) {
      manageModeSwitcher(args);
    };

    function manageModeSwitcher(args) {
      switch (args) {
        // 課程管理模式
        case "course":
          $scope.showCourseManageSection      = true;
          $scope.showCategoryManageSection    = false;
          $scope.showSubcategoryManageSection = false;
          break;
        // 課程單位管理模式
        case "category":
          $scope.showCourseManageSection      = false;
          $scope.showCategoryManageSection    = true;
          $scope.showSubcategoryManageSection = false;
          break;
        // 課程子類別管理模式
        case "subcategory": 
          $scope.showCourseManageSection      = false;
          $scope.showCategoryManageSection    = false;
          $scope.showSubcategoryManageSection = true;
          break;
      }
    }

    // 切換課程單位管理表單模式
    $scope.switchFormPanelMode = function () {
      formPanelModeToggle();
    }

    function formPanelModeToggle() {
      if($scope.panelTitle=="新增單位"){
        // 切換為修改單位模式
        $scope.panelTitle = "修改單位資料";
        document.getElementById('categoryPanel').classList.remove('panel-info');
        document.getElementById('categoryPanel').classList.add('panel-warning');
        $scope.showAddCategoryBtn = false;
        $scope.showEditCategoryBtn = true;
      } else {
        // 切換為新增單位模式
        $scope.panelTitle = "新增單位";
        document.getElementById('categoryPanel').classList.remove('panel-warning');
        document.getElementById('categoryPanel').classList.add('panel-info');
        $scope.showAddCategoryBtn = true;
        $scope.showEditCategoryBtn = false;
      }
    }

    // 課程單位列表被點選，顯示該單位課程列表
    $scope.showCourse = function () {
      $scope.currentSubcategory = undefined;
      $scope.sortType = '';
      for(var id in $scope.categoryList) {
        if($scope.categoryList[id].deptName == this.cat.deptName) {
          $scope.currentCategory = $scope.categoryList[id];
        }
      }
    };

    // 課程子類別被點選，顯示該子類別課程列表
    $scope.subcategoryClick = function (subcategoryName) {
      $scope.currentCategory = undefined;
      $scope.currentSubcategory = subcategoryName;
    }

    // 轉跳新增課程頁面
    $scope.goAdd = function() {
      $state.go('^.addCourse');
    };

    // 課程列表上編輯按鈕被點選，轉跳編輯課程頁面
    $scope.goEdit = function() {
      $state.go('^.editCourse', { course_id: this.course._id });
    };

    // 課程列表上刪除按鈕被點選，跳出確認視窗確認刪除
    $scope.delete = function() {
      var course_id = this.course._id;
      var category_id = this.course.category._id;
      if($window.confirm("被刪除的課程無法被復原\n是否確定要刪除此課程？")){
        var data = {
          course_id  : course_id,
          category_id  : category_id
        }
        CourseService.removeCourse(data).then(function(result){
          $state.go('backend.course', null, { reload: true });
        }, function(err) {
          // err handling ...
        });
      }
    };

    // 更新課程開課狀態
    $scope.stateChanged = function () {
      var course = {
        _id: this.$parent.course._id,
        state: this.$parent.course.state
      }
      var fullNo = this.$parent.course.fullNo;
      var name = this.$parent.course.name;

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
      var fullNo = this.$parent.course.fullNo;
      var name = this.$parent.course.name;
      var course = {
        _id: this.$parent.course._id,
        pinTop: this.$parent.course.pinTop
      }
      CourseService.pinTop(course).then(function (result) {
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
      var fullNo = this.$parent.course.fullNo;
      var name = this.$parent.course.name;
      var course = {
        _id: this.$parent.course._id,
        show: this.$parent.course.show
      }
      CourseService.setShow(course).then(function(result) {
        if (result.nModified) {
          var msg = course.show ? "已更改為顯示" : "已更改為隱藏";

          $window.alert("更新成功！\n\n課號: 「 " + fullNo + " 」  課程名稱: 「" + name + " 」\n" + msg);
        } else {
          $window.alert("發生錯誤，請再試一次！");
        }
      })
    }


    /* 課程單位管理區塊 */
    // 新增課程單位
    $scope.addCategory = function () {
      var data = {
        class: $scope.categoryFormData.class,
        deptName: $scope.categoryFormData.deptName,
        deptCode: $scope.categoryFormData.deptCode,
        show: Boolean($scope.categoryFormData.show)
      }
      CourseService.addCategory(data).then(function(result) {
        $state.go('^.course', {manageMode: 'category'}, {reload: true});
      });
    }

    // 課程單位被點選，進入修改單位模式，在表單上顯示該單位資料
    $scope.showCategoryData = function () {
      if($scope.panelTitle == "新增單位") {
        formPanelModeToggle();
      }
      $scope.categoryFormData.id = this.cat._id;
      $scope.categoryFormData.class = this.cat.class;
      $scope.categoryFormData.deptName = this.cat.deptName;
      $scope.categoryFormData.deptCode = this.cat.deptCode;
      $scope.categoryFormData.show = this.cat.show.toString();
      $window.scrollTo(0, 0);
    }

    // 儲存單位資料
    $scope.saveCategory = function () {
      var data = {
        id: $scope.categoryFormData.id,
        class: $scope.categoryFormData.class,
        deptName: $scope.categoryFormData.deptName,
        deptCode: $scope.categoryFormData.deptCode,
        show: $scope.categoryFormData.show
      }
      CourseService.editCategory(data).then(function(result) {
        $state.go('^.course', {manageMode: 'category'}, {reload: true});
      });
    }

    // 取消修改單位資料，reload單位管理頁面
    $scope.cancel = function () {
      $state.go('^.course', {manageMode: 'category'}, {reload: true});
    }


    /* 課程分類管理區塊 */
    // 新增課程子分類
    $scope.addSubcategory = function (data) {
      var subcategory = {
        name: this.subcategoryName
      }
      CourseService.addSubcategory(subcategory).then(function(result) {
        if (result.success) {
          $window.alert("新增「"+ subcategory.name +"」分類成功！");
          $state.go('^.course', {manageMode: 'subcategory'}, {reload: true});
        } else {
          $window.alert("發生錯誤，請再試一次！");
        }
      }, function(err) {
        // err handling
      });
    }

    // 儲存課程子分類
    $scope.saveSubcategoryName = function () {
      var subcategory = {
        _id: this.$parent.subcat._id,
        name: this.$data
      }
      CourseService.editSubcategory(subcategory).then(function(result) {
        if (result.success) {
          $window.alert("分類更新成功！");
          $state.go('^.course', {manageMode: 'subcategory'}, {reload: true});
        } else {
          $window.alert("發生錯誤，請再試一次！");
        }
      }, function(err) {
        // err handling
      });
    }

    // 移除課程子分類
    $scope.removeSubcategory = function () {
      if($window.confirm("是否確認刪除此課程分類？")) {
        var subcategoryName = this.subcat.name;
        var subcategory = {
          _id: this.subcat._id
        }
        CourseService.removeSubcategory(subcategory).then(function (result) {
          if (result.success) {
            $window.alert("分類「"+ subcategoryName +"」刪除成功！");
            $state.go('^.course', {manageMode: 'subcategory'}, {reload: true});
          } else {
            $window.alert("發生錯誤，請再試一次！");
          }
        });
      }
    }
    
  });

}