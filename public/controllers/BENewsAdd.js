module.exports = (ngModule) => {

  ngModule.controller('BENewsAddCtrl', function(NewsService, $scope, $http, $state, $stateParams, $window){

    $scope.$state = $state;

    $scope.newsShowList = [
      {
        text: "顯示",
        value: true
      },
      {
        text: "隱藏",
        value: false
      }
    ];

    $scope.news = {
      show: true
    };

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

    NewsService.getNewsCategory().then(function(data) {
      $scope.categoryList = data;
      if($scope.categoryList != null) {
        $scope.news.category = $scope.categoryList[0]._id;
      }
    }, function(err) {
      // err handling
    });

    $scope.add = function () {
      NewsService.addNews($scope.news).then(function(data) {
        console.log($scope.news);
        $state.go('^.news');
      }, function(err) {
        // err handling ... 
      });
    };

    $scope.cancel = function () {
      if($window.confirm("若取消編輯此公告，您的更動將不會被儲存。\n是否捨棄編輯公告？")){
        $state.go('^.news');
      }
    };

  });

}