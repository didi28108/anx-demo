/*  The entry file for webpack
 *
 *  NOTICE:
 *    There is some importing issues with webpack.
 *    As we import ng-ckeditor(using bower) and angular-xeditable(using npm)
 *    as modules for dependency injection. Webpack got them as "object" 
 *    instead of "module". This issue leads to angular app instantiate 
 *    failure(failed to setup app) because those modules can not be properly
 *    inject.
 *
 *  Hacky way to solve this prob:
 *    Add a index.js file to the root of each modules(node_modules/angular-xeditable, 
 *    bower_components/ng-ckeditor). In the index.js file, simply import the main file
 *    of the module(angular-xeditable/dist/js/xeditable, ng-ckeditor/ng-ckeditor).
 *    Then simply write module.exports to export them. And make sure to modify 
 *    package.json of the modules. Change the value of "main" property to "index.js",
 *    which means to let the module loader look for index.js file we've created.
 *    The index.js file will look like this:
 *
 *      // node_modules/angular-xeditable/index.js
 *        require('./dist/js/xeditable');
 *        module.exports = 'xeditable';
 *
 *      // bower_components/ng-ckeditor/index.js
 *        require('./ng-ckeditor.js');
 *        module.exports = 'ngCkeditor';
 *  
 *    Make sure to follow the steps above each time you update bower_components or 
 *    install modules from none using npm.
 */

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

// define the app and the DIs
const ngModule = angular.module('myApp', [
  angularUIRouter,
  ngCkeditor,
  xeditable,
  uiBootstrap,
  ClientPaginate
]);

// define the state of our app using angular-ui-router
ngModule.config(($stateProvider, $urlRouterProvider, $locationProvider) => {
  $locationProvider.html5Mode(true);

  $stateProvider
    .state('anx', {     // 首頁
      url: '/',
      templateUrl: require("./views/home.html"),
      controller: 'HomeCtrl'
    })
    .state('course', {    // 課程資訊
      url: '/course/:categoryName',
      templateUrl: require("./views/course.html"),
      controller: 'CourseCtrl'
    })
    .state('viewCourse', {    // 瀏覽課程資訊
      url: '/course/:categoryName/:id',
      templateUrl: require("./views/course-view.html"),
      controller: 'CourseViewCtrl'
    })
    .state('news', {      // 消息公告
      url: '/news',
      templateUrl: require("./views/news.html"),
      params: {
        'default_category': null
      },
      controller: 'NewsCtrl'
    })
    .state('viewNews', {    // 瀏覽消息公告
      url: '/news/:id',
      templateUrl: require("./views/news-view.html"),
      controller: 'NewsViewCtrl'
    })
    .state('pages', {     // 瀏覽其他頁面
      url: '/pages/:abbr',
      templateUrl: require("./views/page.html"),
      controller: 'PageCtrl'
    })
    .state('backend', {     // 後台首頁
      url: '/backend',
      templateUrl: require("./views/backend-home.html"),
      controller: 'BEMainCtrl'
    })
    .state('backend.login', {     // 後台登入頁面
      url: '/login', 
      templateUrl: require("./views/backend-login.html"),
      controller: 'LoginCtrl'
    })
    .state('backend.pages', {     // 後台其他頁面管理
      url: '/pages',
      templateUrl: require("./views/backend-pages.html"),
      params: {
        'default_category': null
      },
      controller: 'BEPagesCtrl'
    })
    .state('backend.course', {      // 後台課程管理
      url: '/course',
      templateUrl: require("./views/backend-course.html"),
      params: {
        'default_category': null,
        'manageMode': null
      },
      controller: 'BECourseCtrl'
    })
    .state('backend.viewCourse', {      // 後台課程瀏覽
      url: '/course/:id',
      templateUrl: require("./views/backend-course-view.html"),
      controller: 'BECourseViewCtrl'
    })
    .state('backend.addCourse', {       // 後台新增課程
      url: '/addCourse',
      templateUrl: require("./views/backend-course-add-or-edit.html"),
      controller: 'BECourseAddCtrl'
    })
    .state('backend.editCourse', {      // 後台編輯課程
      url: '/editCourse',
      templateUrl: require("./views/backend-course-add-or-edit.html"),
      params: {
        'course_id': null
      },
      controller: 'BECourseEditCtrl'
    })
    .state('backend.news', {        // 後台公告管理
      url: '/news',
      templateUrl: require("./views/backend-news.html"),
      params: {
        'default_category': null
      },
      controller: 'BENewsCtrl'
    })
    .state('backend.viewNews', {      // 後台公告瀏覽
      url: '/news/:id',
      templateUrl: require("./views/backend-news-view.html"),
      controller: 'BENewsViewCtrl'
    })
    .state('backend.addNews', {     // 後台新增公告
      url: '/addNews',
      templateUrl: require("./views/backend-news-add-or-edit.html"),
      controller: 'BENewsAddCtrl'
    })
    .state('backend.editNews', {    // 後台編輯公告
      url: '/editNews',
      templateUrl: require("./views/backend-news-add-or-edit.html"),
      params: {
        'news_id': null
      },
      controller: 'BENewsEditCtrl'
    });

    $urlRouterProvider.otherwise('/');
});

// 管理後台登入
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

  // 設定ckeditor主題
  editableOptions.theme = 'bs3';

});

// directives
require('./directives')(ngModule);

// services
require('./services')(ngModule);

// controllers
require('./controllers')(ngModule);