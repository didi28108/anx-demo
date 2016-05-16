// var CourseApi = require('./course');
// var Course = new CourseApi();

var CourseModel = require('./model/course');
var CategoryModel = require('./model/category');

var CategoryProto = {
	'create': function (req, callback) {
		var newCat = new CategoryModel();
		newCat.class = req.body.class;
		newCat.deptName = req.body.deptName;
		newCat.deptCode = req.body.deptCode;
		newCat.show = req.body.show;
		newCat.save(function (err, data) {
			callback(data);
		});
	},

	'update': function (req, callback) {
		console.log(req.body);
		CategoryModel
			.update(
				{ _id: req.body.category_id },
				{ class: req.body.class,
				  deptName: req.body.deptName,
				  deptCode: req.body.deptCode,
				  show: req.body.show
				},
				function(err, data) {
					callback(data);
			});
	},

	'getAll': function (req, callback) {
		CategoryModel
			.find({})
			.exec(function (err, data) {
			callback(data);
		});
	},

	'getShown': function (req, callback) {
		CategoryModel
			.find({})
			.where({show: true})
			.exec(function (err, data) {
			callback(data);
		});
	},

	'countShown': function (callback) {
		CategoryModel
			.find({})
			.where({show: true})
			.exec(function (err, categories) {
				CourseModel
					.find({})
					.where({show: true})
					.select('category show')
					.sort('-createdate')
					.exec(function (err, courses) {
						if (categories && courses) {
							var categoryClone = JSON.parse(JSON.stringify(categories));
							for (var i = 0; i < courses.length ; i++) {
								if(courses[i].show) { // 顯示設定為true的在其對應category計數+1
									for (var k = 0; k < categoryClone.length ; k++) {
										if(courses[i].category == categoryClone[k]._id) {
											if(categoryClone[k].shownCourseCount) categoryClone[k].shownCourseCount++;
											else categoryClone[k].shownCourseCount = 1;
										}
									}
								}
								if(i == courses.length - 1) {
									for (var k = 0; k < categoryClone.length ; k++) {
										if(categoryClone[k].shownCourseCount == undefined) categoryClone[k].shownCourseCount = 0;
										if(k == categoryClone.length - 1) {
											callback(categoryClone);
										}
									}
								}
							}
						} else {
							callback({msg: "categories or courses is null!"});
						}
					});
		});
	},

	'removeAll': function (req, callback) {
		CategoryModel.remove({}, function (err, data) {
			callback(data);
		});
	},

	'pushCourse': function (data, callback) {
		CategoryModel
			.update({ _id: data.category_id }, 
							{$push: {course: [data.course_id]}},
							function (err, course) {
								if (err) throw err;
								else callback(course);
							});
	},

	'pullCourse': function (data, callback) {
		CategoryModel
			.update({ course: [data.course_id] },
							{$pull: { course: [data.course_id]}},
							function (err, course) {
								if (err) throw err;
								else callback(course);
							});
	},

	'getPrevious': function (data, callback) {
		CategoryModel.findOne({ course: [ data.course_id ] }, function (err, cat) {
			callback(cat);
		});
	},

	'createAllFromYuntech': function (data_arr, callback) {
		var categories = [];

		for (var i = data_arr.length - 1; i >= 0; i--) {
			var item = {
				class:		"雲科大",
				deptCode:	data_arr[i].DeptCode,
				deptName:	data_arr[i].DeptName,
				academic:	data_arr[i].Academic
			}
			categories.unshift(item);
			if (i==0) {
				CategoryModel.create(categories, function (err, data) {
					callback(data);
				});
			}
		}
	}
}



function Category(){
	// initial ...
};

Category.prototype = CategoryProto;

module.exports = Category;