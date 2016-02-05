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
	}

}



function Category(){
	// initial ...
};

Category.prototype = CategoryProto;

module.exports = Category;