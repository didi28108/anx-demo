angular.module('myApp')

.controller('HomeCtrl', function(GuestHTTPService, $scope, $http, $state, $stateParams) {

	GuestHTTPService.getPopularCourse().then(function (result) {
		$scope.popularCourses = result;
	});

	GuestHTTPService.getPinTopCourse().then(function (result) {
		$scope.pinTopCourses = result;
	});

	GuestHTTPService.getTenNews().then(function (result) {
		$scope.newsList = result;
	});

});