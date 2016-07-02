module.exports = (ngModule) => {

  ngModule.controller('HomeCtrl', function(GuestHTTPService, $scope, $http, $state, $stateParams) {

    GuestHTTPService.getPopularCourse().then(function (result) {
      $scope.popularCourses = result;
    });

    GuestHTTPService.getPinTopCourse().then(function (result) {
      $scope.pinTopCourses = result;
    });

    GuestHTTPService.getTenNews().then(function (result) {
      $scope.newsList = result;
    });

    GuestHTTPService.getCourseSubcategoryList().then(function (result) {
      $scope.subcategoryList = chunkSubcategoryList(result);
    });

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