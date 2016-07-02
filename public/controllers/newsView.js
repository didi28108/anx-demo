module.exports = (ngModule) => {

  ngModule.controller('NewsViewCtrl', function(GuestHTTPService, NewsService, $scope, $http, $state, $stateParams, $sce){

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

    $scope.showNews = function (news_id) {
      for (var id in $scope.categoryList) {
        if($scope.categoryList[id]._id == news_id) {
          $state.go('^.news', { default_category: $scope.categoryList[id] });
        }
      }
    };

  });

}