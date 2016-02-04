angular.module('myApp')

.controller('MainCtrl', function($scope, $state) {

	$scope.isInBackend = function () {
		return $state.includes("backend");
	}

});