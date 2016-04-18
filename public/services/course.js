var myApp = angular.module('myApp');

myApp.service('CourseService', function($q, $http){

	// 取得所有課程分類
	var getCourseCategoryList = function () {
		return $q(function(resolve, reject) {
			$http.get('/api/getCourseCategory').then(function(result) {
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
			courses[id].startDate 	= courses[id].startDate.substring(0, 10).replace(/-/g, "/");
			courses[id].endDate		= courses[id].endDate.substring(0, 10).replace(/-/g, "/");
			courses[id].confirmDate	= courses[id].confirmDate.substring(0, 10).replace(/-/g, "/");
		}
		return courses;
	};

	var addCourse = function (course) {
		return $q(function(resolve, reject) {
			var req = {
				method	: 'POST',
				url		: '/api/addCourse',
				data 	: {
					course: course
				}
			}
			$http(req).then(function(result) {
				if(result.data) {
					resolve(result.data);
				} else {
					reject("nope");
				}
			});
		});
	};

	var updateCourse = function (course) {
		return $q(function(resolve, reject) {
			var req = {
				method	: 'POST',
				url		: '/api/updateCourse',
				data 	: {
					course: course
				}
			}
			$http(req).then(function(result) {
				if(result.data) {
					resolve(result.data);
				} else {
					reject("nope");
				}
			});
		});
	}

	var updateCourseState = function (course) {
		return $q(function(resolve, reject) {
			var req = {
				method	: 'POST',
				url		: '/api/updateCourseState',
				data 	: {
					course: course
				}
			}
			$http(req).then(function(result) {
				if(result.data) {
					resolve(result.data);
				} else {
					reject("nope");
				}
			});
		});
	}

	// 用_id取得課程
	var getCourse = function (id) {
		return $q(function(resolve, reject) {
			var req = {
				method: 'POST',
				url: '/api/getCourse',
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
				url: '/api/removeCourse',
				data : {
					category_id	: data.category_id,
					course_id	: data.course_id
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

	var clicks = function (id) {
		return $q(function(resolve, reject) {
			var req = {
				method: 'POST',
				url: '/api/courseClicked',
				data: {
					course_id: id
				}
			};
			$http(req).then(function(result) {
				if(result.data) {
					resolve(result.data);
				} else {
					reject('nope');
				}
			});
		});
	}

	var pinTop = function (course) {
		return $q(function(resolve, reject) {
			var req = {
				method: 'POST',
				url: '/api/coursePinTop',
				data: {
					course: course
				}
			};
			$http(req).then(function(result) {
				if(result.data) {
					resolve(result.data);
				} else {
					reject('nope');
				}
			});
		});
	}

	var setShow = function (course) {
		return $q(function(resolve, reject) {
			var req = {
				method: 'POST',
				url: '/api/courseSetShow',
				data: {
					course: course
				}
			};
			$http(req).then(function(result) {
				if(result.data) {
					resolve(result.data);
				} else {
					reject('nope');
				}
			});
		});
	}

	var getCourseDataFromYT = function (data) {
		return $q(function(resolve, reject) {
			var req = {
				method: 'POST',
				url: '/getCourseDataFromYuntech',
				data: {
					year: data.year,
					no: data.no
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

	var addCategory = function (data) {
		return $q(function(resolve, reject) {
			var req = {
				method: 'POST',
				url: '/api/addCourseCategory',
				data: {
					class: data.class,
					deptName: data.deptName,
					deptCode: data.deptCode,
					show: data.show
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

	var editCategory = function (data) {
		return $q(function(resolve, reject) {
			console.log(data);
			var req = {
				method: 'POST',
				url: '/api/editCourseCategory',
				data: {
					category_id: data.id,
					class: data.class,
					deptName: data.deptName,
					deptCode: data.deptCode,
					show: data.show
				}
			}
			$http(req).then(function(result) {
				if(result.data) {
					resolve(result.data);
				} else {
					reject('nope');
				}
			});
		})
	}


	return {
		getCourseCategoryList	: getCourseCategoryList,
		getAllCourse			: getAllCourse,
		getCourse 				: getCourse,
		addCourse 				: addCourse,
		updateCourse			: updateCourse,
		updateCourseState		: updateCourseState,
		removeCourse			: removeCourse,
		clicks					: clicks,
		pinTop 					: pinTop,
		setShow					: setShow,
		getCourseDataFromYT		: getCourseDataFromYT,
		addCategory				: addCategory,
		editCategory			: editCategory
	}

});