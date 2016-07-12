module.exports = (ngModule) => {

  ngModule.controller('PageCtrl', function(PagesService, $scope, $state, $stateParams, $http, $window, $sce) {
    
    /*  頁面瀏覽controller
     *  template: views/page.html
     *  主要功能:
     *    - 瀏覽頁面內容
     */

    // 取得頁面
    PagesService.getPage($stateParams.abbr).then(function (data) {
      if(data.notfound) {
        $state.go('anx');
      } else {
        // 取得所有頁面，不包含內容
        PagesService.getPagesWithoutContent().then(function (allPages) {
          var tmp = [];
          for(var index in allPages) {
            if(allPages[index].category == data.category._id) {
              tmp.push(allPages[index]);
            }
          }
          $scope.categoryList = tmp;
        });
        // load up data
        $scope.page = data;
        $scope.page.content = $sce.trustAsHtml($scope.page.content);
      }
    }, function (err) {
      // err handling ...
    });

  });

}