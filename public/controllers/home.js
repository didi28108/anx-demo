module.exports = (ngModule) => {

  ngModule.controller('HomeCtrl', function(GuestHTTPService, $scope, $http, $state, $stateParams) {

    /*  首頁controller
     *  template: views/home.html
     *  主要功能:
     *    - 顯示最新消息
     *    - 顯示課程子類別
     *    - 顯示熱門課程
     *    - 顯示推薦課程
     */

    // 取得熱門課程
    GuestHTTPService.getPopularCourse().then(function (result) {
      $scope.popularCourses = result;
    });

    // 取得推薦課程
    GuestHTTPService.getPinTopCourse().then(function (result) {
      $scope.pinTopCourses = result;
    });

    // 取得最新消息
    GuestHTTPService.getTenNews().then(function (result) {
      $scope.newsList = result;
    });

    // 取得課程子類別
    GuestHTTPService.getCourseSubcategoryList().then(function (result) {
      $scope.subcategoryList = chunkSubcategoryList(result);
    });

    // 將課程子類別陣列改為四個一行
    const chunkSubcategoryList = (subcategoryList) => {
      let list = [];
      subcategoryList.map(
        (e, i) => {
          let row = Math.floor(i / 4);
          let rowIndex = i % 4;
          if(list[row] == undefined) {
            list[row] = [];
          }
          list[row].push(e);
          return e;
        }
      );
      if(subcategoryList.length % 4 != 0) {
        for (var i = 0; i < 4 - subcategoryList.length % 4; i++) {
          list[Math.floor((subcategoryList.length - 1) / 4)].push({});
        }
      }
      return (list);
    }
  });

}