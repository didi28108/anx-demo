angular.module('myApp')

.controller('HomeCtrl', function(HomePageService, $scope, $http, $state, $stateParams) {

	HomePageService.getPopularCourse().then(function (result) {
		$scope.popularCourses = result;
	});

	HomePageService.getPinTopCourse().then(function (result) {
		$scope.pinTopCourses = result;
	});

	HomePageService.getTenNews().then(function (result) {
		$scope.newsList = result;
		console.log(result);
	});

});