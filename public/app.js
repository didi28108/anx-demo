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
		.state('backend.course', {
			url: '/course',
			templateUrl: 'views/backend-course.html',
			// controller: 'BECourseCtrl'
			// data: {
			// 	needLogin: true
			// }
		})
		.state('backend.addCourse', {
			url: '/addCourse',
			templateUrl: 'views/backend-course-add-or-edit.html',
			controller: 'BECourseAddCtrl'
		})
		.state('backend.editCourse', {
			url: '/editCourse',
			templateUrl: 'views/backend-course-add-or-edit.html',
			params: { 'course_id': null },
			controller: 'BECourseEditCtrl'
		})
		.state('backend.news', {
			url: '/news',
			templateUrl: 'views/backend-news.html',
			controller: 'BENewsCtrl'
		})

		;

	  $urlRouterProvider.otherwise('/');
})

.run(function($rootScope, $state, AuthService){

	$rootScope.$on('$stateChangeStart', function(event, next, nextParams, fromState) {
		if (!AuthService.isAuthenticated()) {
			console.log("current state: " + next.name);
			if (next.name === 'backend' ||
					next.name === 'backend.course' ||
					next.name === 'backend.addCourse' ||
					next.name === 'backend.editCourse' ||
					newx.name === 'backend.news') {
				event.preventDefault();
				$state.go('backend.login');
			}
		}
	});
});