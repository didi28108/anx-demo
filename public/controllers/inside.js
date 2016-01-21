var myApp = angular.module('myApp');

myApp.controller('InsideCtrl', function($scope, AuthService, $http, $state){
	$scope.destroySession = function() {
		AuthService.logout();
	};

	$http.get('/api/userinfo').then(function(result) {
		$scope.userinfo = result.data.msg;
	});

	$scope.logout = function() {
		AuthService.logout();
		$state.go('backend.login');
	};
});