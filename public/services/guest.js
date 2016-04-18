var myApp = angular.module('myApp');

myApp.service('GuestHTTPService', function($q, $http){

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

	var getAllShownCourse = function () {
		return $q(function(resolve, reject) {
			$http.get('/api/getAllShownCourse').then(function(result) {
				if(result.data) {
					resolve(course_date_transform(result.data));
				} else {
					reject('nope');
				}
			});
		});
	}

	var getShownCourseCount = function () {
		return $q(function(resolve, reject) {
			$http.get('/api/countShownCourse').then(function(result) {
				if(result.data) {
					resolve(result.data);
				} else {
					reject('nope');
				}
			});
		});
	}

	var getAllShownNews = function () {
		return $q(function(resolve, reject) {
			$http.get('/api/getAllShownNews').then(function(result) {
				if(result.data) {
					resolve(news_date_transform(result.data));
				} else {
					reject('nope');
				}
			});
		});
	}

	var getShownNewsCount = function () {
		return $q(function(resolve, reject) {
			$http.get('/api/countShownNews').then(function(result) {
				if(result.data) {
					resolve(result.data);
				} else {
					reject('nope');
				}
			});
		});
	}

	// 取得課程後將日期格式轉為yyyy-mm-dd
	function course_date_transform (courses) {
		for(id in courses) {
			courses[id].startDate 	= courses[id].startDate.substring(0, 10).replace(/-/g, "/");
			courses[id].endDate		= courses[id].endDate.substring(0, 10).replace(/-/g, "/");
			courses[id].confirmDate	= courses[id].confirmDate.substring(0, 10).replace(/-/g, "/");
		}
		return courses;
	};

	// 取得消息公告後將日期格式轉為yyyy-mm-dd
	function news_date_transform (news) {
		for(id in news) {
			news[id].createdate 	= news[id].createdate.substring(0, 10).replace(/-/g, "/");
		}
		return news;
	};

	return {
		getPopularCourse	: getPopularCourse,
		getPinTopCourse		: getPinTopCourse,
		getAllShownCourse	: getAllShownCourse,
		getShownCourseCount	: getShownCourseCount,
		getTenNews			: getTenNews,
		getAllShownNews		: getAllShownNews,
		getShownNewsCount	: getShownNewsCount
	}
});