angular.module('myApp', ['ui.router', 'ngCkeditor', 'ClientPaginate', 'xeditable', 'ui.bootstrap'])

.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
	$locationProvider.html5Mode(true);

	$stateProvider
		.state('anx', {
			url: '/',
			templateUrl: 'views/home.html'
		})
		.state('course', {
			url: '/course',
			templateUrl: 'views/course.html',
			params: { 'default_category': null, 'default_subcategory': null },
			controller: 'CourseCtrl'
		})
		.state('viewCourse', {
			url: '/course/:id',
			templateUrl: 'views/course-view.html',
			controller: 'CourseViewCtrl'
		})
		.state('news', {
			url: '/news',
			templateUrl: 'views/news.html',
			params: { 'default_category': null },
			controller: 'NewsCtrl'
		})
		.state('viewNews', {
			url: '/news/:id',
			templateUrl: 'views/news-view.html',
			controller: 'NewsViewCtrl'
		})
		.state('pages', {
			url: '/pages/:abbr',
			templateUrl: 'views/page.html',
			controller: 'PageCtrl'
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
		.state('backend.pages', {
			url: '/pages',
			templateUrl: 'views/backend-pages.html',
			params: { 'default_category': null },
			controller: 'BEPagesCtrl'
		})
		.state('backend.course', {
			url: '/course',
			templateUrl: 'views/backend-course.html',
			params: { 'default_category': null, 'manageMode': null },
			controller: 'BECourseCtrl'
		})
		.state('backend.viewCourse', {
			url: '/course/:id',
			templateUrl: 'views/backend-course-view.html',
			controller: 'BECourseViewCtrl'
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
			params: { 'default_category': null },
			controller: 'BENewsCtrl'
		})
		.state('backend.viewNews', {
			url: '/news/:id',
			templateUrl: 'views/backend-news-view.html',
			controller: 'BENewsViewCtrl'
		})
		.state('backend.addNews', {
			url: '/addNews',
			templateUrl: 'views/backend-news-add-or-edit.html',
			controller: 'BENewsAddCtrl'
		})
		.state('backend.editNews', {
			url: '/editNews',
			templateUrl: 'views/backend-news-add-or-edit.html',
			params: { 'news_id': null },
			controller: 'BENewsEditCtrl'
		})

		;

	  $urlRouterProvider.otherwise('/');
})

.run(function($rootScope, $state, AuthService, editableOptions, $window){

	$rootScope.$on('$stateChangeStart', function(event, next, nextParams, fromState) {
		// console.log('current state: ', next.name);
		if (!AuthService.isAuthenticated()) {
			if (next.name === 'backend' ||
					next.name === 'backend.pages' ||
					next.name === 'backend.course' ||
					next.name === 'backend.viewCourse' ||
					next.name === 'backend.addCourse' ||
					next.name === 'backend.editCourse' ||
					next.name === 'backend.news' ||
					next.name === 'backend.viewNews' ||
					next.name === 'backend.addNews' ||
					next.name === 'backend.editNews') {
				event.preventDefault();
				$state.go('backend.login');
			}
		}
		if (next.name === 'pages' || 
			next.name === 'viewCourse' ||
			next.name === 'viewNews' ||
			next.name === 'course' ||
			next.name === 'news') {
			$window.scrollTo(0, 0);
		}
	});

	editableOptions.theme = 'bs3';

});