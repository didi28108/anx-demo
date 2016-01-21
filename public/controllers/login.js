var myApp = angular.module('myApp');

myApp.controller('LoginCtrl', function($scope, AuthService, $state){
	$scope.msg = '';
	$scope.user = {name: '', password: ''};

	$scope.login = function (data) {
		AuthService.login($scope.user).then(function(msg) {
			$state.go('backend.inside', null, { reload: true });
		}, function(errMsg) {
			$scope.msg = errMsg;
			$scope.user = {name: '', password: ''};
		});
	}
});