import jQuery from 'jquery';

import angular from 'angular';
import angularUIRouter from 'angular-ui-router';

// third party lib
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min';

// ckeditor was loaded on index.html script tag
import ckeditor from 'ckeditor';
import ngCkeditor from 'ng-ckeditor';
import 'ng-ckeditor/ng-ckeditor.css';

import 'angular-xeditable/dist/css/xeditable.min.css';
import xeditable from 'angular-xeditable';

import uiBootstrap from 'angular-ui-bootstrap';

import 'font-awesome/css/font-awesome.min.css';

// css
import './css/bootstrap-datepicker3.min.css';
import './css/main.css';

// modules for our app
import ClientPaginate from './modules/ClientPaginate';


const ngModule = angular.module('myApp', [
  angularUIRouter,
  ngCkeditor,
  xeditable,
  uiBootstrap,
  ClientPaginate
]);

ngModule.config(($stateProvider, $urlRouterProvider, $locationProvider) => {
	$locationProvider.html5Mode(true);

	$stateProvider
		.state('anx', {
			url: '/',
			templateUrl: require("./views/home.html"),
			controller: 'HomeCtrl'
		})
		.state('course', {
			url: '/course/:categoryName',
			templateUrl: require("./views/course.html"),
			params: {
				'default_category': null,
				'default_subcategory': null
			},
			controller: 'CourseCtrl'
		})
		.state('viewCourse', {
			url: '/course/:categoryName/:id',
			templateUrl: require("./views/course-view.html"),
			controller: 'CourseViewCtrl'
		})
		.state('news', {
			url: '/news',
			templateUrl: require("./views/news.html"),
			params: {
				'default_category': null
			},
			controller: 'NewsCtrl'
		})
		.state('viewNews', {
			url: '/news/:id',
			templateUrl: require("./views/news-view.html"),
			controller: 'NewsViewCtrl'
		})
		.state('pages', {
			url: '/pages/:abbr',
			templateUrl: require("./views/page.html"),
			controller: 'PageCtrl'
		})
		.state('backend', {
			url: '/backend',
			templateUrl: require("./views/backend-home.html")
		})
		.state('backend.login', {
			url: '/login', 
			templateUrl: require("./views/backend-login.html"),
			controller: 'LoginCtrl'
		})
		.state('backend.pages', {
			url: '/pages',
			templateUrl: require("./views/backend-pages.html"),
			params: {
				'default_category': null
			},
			controller: 'BEPagesCtrl'
		})
		.state('backend.course', {
			url: '/course',
			templateUrl: require("./views/backend-course.html"),
			params: {
				'default_category': null,
				'manageMode': null
			},
			controller: 'BECourseCtrl'
		})
		.state('backend.viewCourse', {
			url: '/course/:id',
			templateUrl: require("./views/backend-course-view.html"),
			controller: 'BECourseViewCtrl'
		})
		.state('backend.addCourse', {
			url: '/addCourse',
			templateUrl: require("./views/backend-course-add-or-edit.html"),
			controller: 'BECourseAddCtrl'
		})
		.state('backend.editCourse', {
			url: '/editCourse',
			templateUrl: require("./views/backend-course-add-or-edit.html"),
			params: {
				'course_id': null
			},
			controller: 'BECourseEditCtrl'
		})
		.state('backend.news', {
			url: '/news',
			templateUrl: require("./views/backend-news.html"),
			params: {
				'default_category': null
			},
			controller: 'BENewsCtrl'
		})
		.state('backend.viewNews', {
			url: '/news/:id',
			templateUrl: require("./views/backend-news-view.html"),
			controller: 'BENewsViewCtrl'
		})
		.state('backend.addNews', {
			url: '/addNews',
			templateUrl: require("./views/backend-news-add-or-edit.html"),
			controller: 'BENewsAddCtrl'
		})
		.state('backend.editNews', {
			url: '/editNews',
			templateUrl: require("./views/backend-news-add-or-edit.html"),
			params: {
				'news_id': null
			},
			controller: 'BENewsEditCtrl'
		});

	  $urlRouterProvider.otherwise('/');
});

ngModule.run(($rootScope, $state, AuthService, editableOptions, $window) => {
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

// directives
require('./directives')(ngModule);

// services
require('./services')(ngModule);

// controllers
require('./controllers')(ngModule);