module.exports = (ngModule) => {

  ngModule.controller('CourseCtrl', function(Paginator, GuestHTTPService, $scope, $http, $state, $stateParams, $window){

    /*  前台課程controller
     *  template: views/course.html
     *  主要功能:
     *    - 以列表呈現課程資訊
     *    - 以課程單位及課程分類篩選呈現課程列表
     */

    // 課程單位、分類被點選
    $scope.changeCategory = function(category) {
      $state.transitionTo('course', {categoryName: category}, { notify: false });
      setCurrentCategory(category);
      
      $scope.sortType  = '';
      $scope.sortReverse  = false;
      $scope.searchFish = '';
    }

    $scope.currentCategory = '';
    $scope.currentSubcategory;

    // $scope.classes = ['雲科大', '政府單位'];

    // 搜尋列相關變數
    $scope.sortType  = '';
    $scope.sortReverse  = false;
    $scope.searchFish = '';

    // Paginator預設單頁資料筆數
    $scope.rowsPerPage = 20;

    // 取得所有課程類別和子類別
    GuestHTTPService.getAllShownCourseCategorySubcategory().then(function(data) {
      $scope.categoryList = data.category;
      $scope.subcategoryList = data.subcategory;

      setCurrentCategory($stateParams.categoryName);
      
    }, function(err) {
      // err handling
    });

    // 取得所有狀態為顯示的課程
    GuestHTTPService.getAllShownCourse().then(function(data) {
      $scope.courses = data;
    }, function(err) {
      // err handling
    });

    // show course on list when a category is clicked
    $scope.showCourse = function () {
      $scope.currentSubcategory = undefined;
      $scope.sortType = '';
      for(var id in $scope.categoryList) {
        if($scope.categoryList[id].deptCode == this.cat.deptCode) {
          $scope.currentCategory = $scope.categoryList[id];
          Paginator.setPage(0);
        }
      }
    }

    // 設定當前瀏覽類別
    var setCurrentCategory = function(categoryName) {
      $scope.currentCategory = undefined;
      $scope.currentSubcategory = undefined;
      if(categoryName) {
        // if state params has a categoryName
        // look for category data in array with all course categories
        $scope.categoryList.map(function(e, i) {
          if(categoryName == e.deptCode) {
            // category found, set as currentCategory,
            // then set currentSubcategory as undefined
            $scope.currentCategory = e;
            $scope.currentSubcategory = undefined;
          }
        });
        if(!$scope.currentCategory) {
          // if categoryName is not found in all categories
          // look for it again in array with all course subcategories
          $scope.subcategoryList.map(function(e, i) {
            if(categoryName == e.name) {
              // subcategory found, set as currentSubcategory
              // then set currentCategory as undefined
              $scope.currentCategory = undefined;
              $scope.currentSubcategory = e.name;
            }
          });
          if(!$scope.currentSubcategory) {
            // if categoryName is not found in both categories and subcategories
            // give currentCategory a category as default value
            setCurrentCategoryAsDefault();
          }
        }
      } else {
        // if there is no categoryName in state params
        // give currentCategory a category as default value
        setCurrentCategoryAsDefault();
      }
      
    }

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

  });

}