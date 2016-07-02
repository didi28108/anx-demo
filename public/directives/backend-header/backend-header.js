module.exports = function (ngModule) {
  require('./backend-header.css');
  ngModule.directive('backendHeader', backendHeaderFn);
  function backendHeaderFn() {
    return {
      restrict: 'E',
      transclude: true,
      scope: {},
      templateUrl: require("./backend-header.html"),
      controller: ['$scope', '$interval', function($scope, $interval) {
        $interval(function () {
          var y = new Date().getFullYear();
          var m = new Date().getMonth()+1;
          var d = new Date().getDate();
          $scope.date = y+'/'+m+'/'+d;
          $scope.time = new Date().toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
        }, 1000);
      }]
    }
  }
}