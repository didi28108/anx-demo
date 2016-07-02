module.exports = (ngModule) => {

  ngModule.controller('BENewsCtrl', function(NewsService, $scope, $http, $state, $stateParams, $window){

    /*  後台公告管理controller
     *  template: views/backend-news.html
     *  主要功能:
     *    - 列表呈現消息公告
     *    - 前往新增、編輯、刪除、更新顯示狀態
     */
    
    // 將目前的$state注入$scope中，供views使用
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

    $scope.currentCategory = '';

    $scope.sortType = '';
    $scope.sortReverse = false;
    $scope.searchFish = '';

    // 從Service取得消息公告類別
    NewsService.getNewsCategory().then(function(data) {
      $scope.categoryList = data;
      if($stateParams.default_category == null) {
        $scope.currentCategory = $scope.categoryList[0];
      } else {
        $scope.currentCategory = $stateParams.default_category;
      }
    }, function(err) {
      // err handling
    });

    // 從Service取得所有消息公告
    NewsService.getAllNews().then(function(data) {
      $scope.newsList = data;
    }, function(err) {
      // err handling
    });

    // 點選類別列表上的類別時顯示該類別的消息公告在右側
    $scope.showNews = function (news_id) {
      $scope.sortType = '';
      for(var id in $scope.categoryList) {
        if($scope.categoryList[id]._id == news_id) {
          $scope.currentCategory = $scope.categoryList[id];
        }
      }
    };

    // 前往新增公告
    $scope.goAdd = function() {
      $state.go('^.addNews');
    };

    /* news list options */
    // edit course
    $scope.goEdit = function() {
      $state.go('^.editNews', { news_id: this.news._id });
    };

    $scope.delete = function() {
      var news_id = this.news._id;
      if($window.confirm("被刪除的消息公告無法被復原\n是否確定要刪除？")){
        NewsService.removeNews(news_id).then(function(result){
          console.log('remove succeeded!');
          $state.go('backend.news', null, { reload: true });
        }, function(err) {
          // err handling ...
        });
      }
    };

    $scope.showChanged = function () {
      var title = this.$parent.news.title;
      var news = {
        _id: this.$parent.news._id,
        show: this.$parent.news.show
      }
      NewsService.setShow(news).then(function(result) {
        console.log(result);
        if (result.nModified) {
          var msg = news.show ? "已更改為顯示" : "已更改為隱藏";
          $window.alert("更新成功！\n\n公告: 「 " + title + " 」\n" + msg);
        } else {
          $window.alert("發生錯誤，請再試一次！");
        }
      });
    }

  });

}