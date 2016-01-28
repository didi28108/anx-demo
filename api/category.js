var CategoryModel = require('./model/category');

var CategoryProto = {
	'create': function (req, callback) {
		var newCat = new CategoryModel();
		newCat.name = req.body.name;
		newCat.abbr = req.body.abbr;
		newCat.save(function (err, data) {
			callback(data);
		});
	},

	'getAll': function (req, callback) {
		CategoryModel
			.find({})
			.sort('abbr')
			// .select('name abbr')
			.exec(function (err, data) {
			callback(data);
		});
	},

	'removeAll': function (req, callback) {
		CategoryModel.remove({}, function (err, data) {
			callback(data);
		});
	},

	'pushCourse': function (data_from_courseapi, callback) {
		CategoryModel
			.update({ _id: data_from_courseapi.category_id }, 
							{$push: {course: [data_from_courseapi.course_id]}},
							function (err, course) {
								if (err) throw err;
								else callback(course);
							});
	},

	'pullCourse': function (data_from_courseapi, callback) {
		CategoryModel
			.update({ _id: data_from_courseapi.category_id },
							{$pull: { course: [data_from_courseapi.course_id]}},
							function (err, course) {
								if (err) throw err;
								else callback(course);
							});
	}

}



function Category(){
	// initial ...
};

Category.prototype = CategoryProto;

module.exports = Category;