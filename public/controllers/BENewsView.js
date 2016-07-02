module.exports = (ngModule) => {

  ngModule.controller('BENewsViewCtrl', function(NewsService, $scope, $http, $state, $stateParams, $window, $sce){
    
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

    NewsService.getNewsCategory().then(function(data) {
      $scope.categoryList = data;
    }, function(err) {
      // err handling
    });

    NewsService.getNews($stateParams.id).then(function(data) {
      $scope.news = data;
      $scope.news.content = $sce.trustAsHtml(data.content);
    });

    $scope.showNews = function (news_id) {
      for(var id in $scope.categoryList) {
        if($scope.categoryList[id]._id == news_id) {
          $state.go('^.news', { default_category: $scope.categoryList[id] });
        }
      }
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
      var title = this.news.title;
      var news = {
        _id: this.news._id,
        show: this.news.show
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