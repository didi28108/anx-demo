angular.module('myApp')

.controller('BackendMainCtrl', function($scope, AuthService, $state, $http, $window){
	$scope.isLogin = AuthService.isAuthenticated();

	$http.get('/api/userinfo').then(function(result) {
		$scope.userinfo = 'hi, ' + result.data.name;
	}, function(err) {
		// err handling
	});

	$scope.logout = function() {
		AuthService.logout();
		$state.go('backend.login', null, { reload: true });
	};
});
