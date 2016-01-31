var myApp = angular.module('myApp');

myApp.service('CourseService', function($q, $http){

	// 取得所有課程分類
	var getCourseCategoryList = function () {
		return $q(function(resolve, reject) {
			$http.get('/api/getCategory').then(function(result) {
				if(result.data) {
					resolve(result.data);
				} else {
					reject('nope');
				}
			});
		});
	}

	// 取得所有課程
	var getAllCourse = function () {
		return $q(function(resolve, reject) {
			$http.get('/api/getAllCourse').then(function(result) {
				if(result.data) {
					resolve(course_date_transform(result.data));
				} else {
					reject('nope');
				}
			});
		});
	}
	// 取得課程後將日期格式轉為yyyy-mm-dd
	function course_date_transform (courses) {
		for(id in courses) {
			courses[id].startdate 	= courses[id].startdate.substring(0, 10).replace(/-/g, "/");
			courses[id].enddate			= courses[id].enddate.substring(0, 10).replace(/-/g, "/");
			courses[id].confirmdate	= courses[id].confirmdate.substring(0, 10).replace(/-/g, "/");
		}
		return courses;
	};

	// 用_id取得課程
	var getCourse = function (id) {
		return $q(function(resolve, reject) {
			var req = {
				method: 'POST',
				url: 		'/api/getCourse',
				data: {
					course_id: id
				}
			}
			$http(req).then(function(result) {
				if(result.data) {
					resolve(result.data);
				} else {
					reject('nope');
				}
			});
		});
	}

	// 用_id刪除課程
	var removeCourse = function (data) {
		return $q(function(resolve, reject) {
			var req = {
				method: 'POST',
				url: 		'/api/removeCourse',
				data : {
					category_id	: data.category_id,
					course_id		: data.course_id
				}
			};
			$http(req).then(function(result){
				if(result.data) {
					resolve(result.data);
				} else {
					reject('nope');
				}
			});
		});
	}


	return {
		getCourseCategoryList		: getCourseCategoryList,
		getAllCourse						: getAllCourse,
		getCourse 							: getCourse,
		removeCourse						: removeCourse
	}

});