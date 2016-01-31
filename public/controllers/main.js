var myApp = angular.module('myApp');

myApp.controller('MainCtrl', function($scope, $state) {

	$scope.isInBackend = function () {
		return $state.includes("backend");
	}

});