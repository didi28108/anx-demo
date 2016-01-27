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
			.select('name abbr')
			.exec(function (err, data) {
			callback(data);
		});
	},

	'removeAll': function (req, callback) {
		CategoryModel.remove({}, function (err, data) {
			callback(data);
		});
	}
}



function Category(){
	// initial ...
};

Category.prototype = CategoryProto;

module.exports = Category;