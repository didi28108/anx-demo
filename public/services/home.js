var myApp = angular.module('myApp');

myApp.service('HomePageService', function($q, $http){

	var getPopularCourse = function () {
		return $q(function(resolve, reject) {
			$http.get('/api/getPopularCourse').then(function(result) {
				if(result.data) {
					resolve(result.data);
				} else {
					reject('nope');
				}
			});
		});
	}

	var getPinTopCourse = function () {
		return $q(function(resolve, reject) {
			$http.get('/api/getPinTopCourse').then(function(result) {
				if(result.data) {
					resolve(result.data);
				} else {
					reject('nope');
				}
			});
		});
	}

	var getTenNews = function () {
		return $q(function(resolve, reject) {
			$http.get('/api/getTenNews').then(function(result) {
				if(result.data) {
					resolve(result.data);
				} else {
					reject('nope');
				}
			});
		});
	}



	return {
		getPopularCourse	: getPopularCourse,
		getPinTopCourse		: getPinTopCourse,
		getTenNews			: getTenNews
	}
});