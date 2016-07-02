module.exports = (ngModule) => {

  ngModule.controller('CourseViewCtrl', function(GuestHTTPService, CourseService, $scope, $http, $state, $stateParams, $sce){
    // $scope.classes = ['雲科大', '政府單位'];
    
    // 用課程_id取得課程
    CourseService.getCourse($stateParams.id).then(function(result) {
      if (result.notfound) {
        $state.go('^.course');
      } else {
        CourseService.clicks($stateParams.id);

        $scope.course = result;
        $scope.course.startDate     = $scope.course.startDate.substring(0,10);
        $scope.course.endDate       = $scope.course.endDate.substring(0,10);
        $scope.course.confirmDate   = $scope.course.confirmDate.substring(0,10);
        $scope.course.startTime     = $scope.course.startTime;
        $scope.course.endTime       = $scope.course.endTime;
        $scope.course.enrollDueDate = $scope.course.enrollDueDate.substring(0,10);
        $scope.course.remark        = $sce.trustAsHtml($scope.course.remark);
        $scope.course.goal          = $sce.trustAsHtml($scope.course.goal);
        $scope.course.info          = $sce.trustAsHtml($scope.course.info);
        $scope.course.lecturerInfo  = $sce.trustAsHtml($scope.course.lecturerInfo);
      }
    }, function (err) {
      // err handling
    });

    // 取得所有課程類別和子類別
    GuestHTTPService.getAllShownCourseCategorySubcategory().then(function(data) {
      $scope.categoryList = data.category;
      $scope.subcategoryList = data.subcategory;

      setCurrentCategory($stateParams.categoryName);
      
    }, function(err) {
      // err handling
    });

    $scope.showCourse = function() {
      for(var id in $scope.categoryList) {

        if($scope.categoryList[id].deptName == this.cat.deptName) {
          $state.go('^.course', { default_category: $scope.categoryList[id] });
        }
      }
    };

    $scope.subcategoryClick = function (subcategoryName) {
      $state.go('^.course', { default_subcategory: subcategoryName });
    }


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
          console.log('try to set subcategory');
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