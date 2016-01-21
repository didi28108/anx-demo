var myApp = angular.module('myApp');

myApp.controller('BackendMainCtrl', function($scope, AuthService, $state){
	$scope.isLogin = AuthService.isAuthenticated();

	$scope.logout = function() {
		AuthService.logout();
		$state.go('backend.login', null, { reload: true });
	};
});
