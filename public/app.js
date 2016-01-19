var myApp = angular.module('myApp', ['ngRoute']);

myApp.config(function($routeProvider, $locationProvider) {
	$locationProvider.html5Mode(true);

	$routeProvider
		.when('/', {
			templateUrl: 'views/home.html'
		})
		.when('/course', {
			templateUrl: 'views/course.html'
		})
		.when('/news', {
			templateUrl: 'views/news.html'
		})
		.when('/backend', {
			templateUrl: 'views/backend-home.html'
		})
		.when('/backend/login', {
			templateUrl: 'views/backend-login.html'
		})
		.when('/backend/test',  {
			templateUrl: 'views/test.html'
		})
		.otherwise({
			redirectTo: '/'
		});

});

myApp.controller('loginCtrl', function($scope){
		$scope.login = function (argument) {

			var username = $scope.username;
			var password = $scope.password;

			if($scope.username == 'admin' && $scope.password == 'admin') {
				$location.path('/backend/test');
			}
		}
});