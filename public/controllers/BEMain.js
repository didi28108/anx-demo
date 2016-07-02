module.exports = (ngModule) => {

	ngModule.controller('BEMainCtrl', function($scope, AuthService, $state, $http, $window){

		/*  後台登入頁面controller
		 *  template: views/backend-home.html
		 *  主要功能:
		 *    - 登入
		 *    - 登出
		 */

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

}