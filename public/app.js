var myApp = angular.module('myApp', ['ui.router']);

// myApp.config(function($routeProvider, $locationProvider) {
// 	$locationProvider.html5Mode(true);

// 	$routeProvider
// 		.when('/', {
// 			templateUrl: 'views/home.html'
// 		})
// 		.when('/course', {
// 			templateUrl: 'views/course.html'
// 		})
// 		.when('/news', {
// 			templateUrl: 'views/news.html'
// 		})
// 		.when('/backend', {
// 			templateUrl: 'views/backend-home.html'
// 		})
// 		.when('/backend/login', {
// 			templateUrl: 'views/backend-login.html'
// 		})
// 		.when('/backend/test',  {
// 			templateUrl: 'views/test.html'
// 		})
// 		.otherwise({
// 			redirectTo: '/'
// 		});

// });

myApp.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
	$locationProvider.html5Mode(true);

	$stateProvider
		.state('anx', {
			url: '/',
			templateUrl: 'views/home.html'
		})
		.state('course', {
			url: '/course',
			templateUrl: 'views/course.html'
		})
		.state('news', {
			url: '/news',
			templateUrl: 'views/news.html'
		})
		.state('backend', {
			url: '/backend',
			templateUrl: 'views/backend-home.html'
		})
		.state('backend.login', {
			url: '/login', 
			templateUrl: 'views/backend-login.html',
			controller: 'LoginCtrl'
		})
		.state('backend.inside', {
			url: '/inside',
			templateUrl: 'views/backend-inside.html',
			controller: 'InsideCtrl'
			// data: {
			// 	needLogin: true
			// }
		})

		;

	  $urlRouterProvider.otherwise('/');
})

.run(function($rootScope, $state, AuthService){
	// $rootScope.$on('$stateChangeStart', function(e, to) {
	// 	if (to.data && to.data.needLogin) {
	// 		if (!AuthService.isAuthenticated()) {
	// 			e.preventDefault();
	// 			$state.go('backend.login');
	// 		}
	// 	}
	// });

	$rootScope.$on('$stateChangeStart', function(event, next, nextParams, fromState) {
		if (!AuthService.isAuthenticated()) {
			console.log("current state: " + next.name);
			if (next.name === 'backend' ||
					next.name === 'backend.inside') {
				event.preventDefault();
				$state.go('backend.login');
			}
		}
	});
});