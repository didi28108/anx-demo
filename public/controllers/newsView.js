module.exports = (ngModule) => {

  ngModule.controller('NewsViewCtrl', function(GuestHTTPService, NewsService, $scope, $http, $state, $stateParams, $sce){
    
    /*  消息公告瀏覽controller
     *  template: views/news-view.html
     *  主要功能:
     *    - 瀏覽公告內容
     */

    // 取得公告
    NewsService.getNews($stateParams.id).then(function(data) {
      if(data.notfound) {
        $state.go('^.news');
      } else {
        NewsService.clicks(data._id);
        $scope.news  = data;
        $scope.news.content = $sce.trustAsHtml($scope.news.content);

        NewsService.getNewsCategory().then(function(data) {
          $scope.categoryList = data;

          GuestHTTPService.getShownNewsCount().then(function (data) {
            for (var i = 0; i < data.length; i++) {
              $scope.categoryList[i].shownNewsCount = data[i].shownNewsCount;
            }
          }, function(err) {
            // err handling
          });
        }, function(err) {
          // err handling
        });
      }
    });

    // 轉跳消息公告頁面，顯示被點選類別的公告列表
    $scope.showNews = function (news_id) {
      for (var id in $scope.categoryList) {
        if($scope.categoryList[id]._id == news_id) {
          $state.go('^.news', { default_category: $scope.categoryList[id] });
        }
      }
    };

  });

}