module.exports = (ngModule) => {

  ngModule.controller('BENewsAddCtrl', function(NewsService, $scope, $http, $state, $stateParams, $window){

    /*  後台新增公告管理controller
     *  template: views/backend-news-add-or-edit.html
     *  主要功能:
     *    - 新增公告
     */

    // 將目前的$state注入$scope中，供views使用
    $scope.$state = $state;

    // 公告顯示狀態預設值陣列
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

    // 取得公告類別
    NewsService.getNewsCategory().then(function(data) {
      $scope.categoryList = data;
      if($scope.categoryList != null) {
        $scope.news.category = $scope.categoryList[0]._id;
      }
    }, function(err) {
      // err handling
    });

    // 新增消息
    $scope.add = function () {
      NewsService.addNews($scope.news).then(function(data) {
        console.log($scope.news);
        $state.go('^.news');
      }, function(err) {
        // err handling ... 
      });
    };

    // 取消
    $scope.cancel = function () {
      if($window.confirm("若取消編輯此公告，您的更動將不會被儲存。\n是否捨棄編輯公告？")){
        $state.go('^.news');
      }
    };

  });

}