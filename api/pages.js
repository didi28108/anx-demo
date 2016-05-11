var PagesModel = require('./model/pages');
var PagesCategoryModel = require('./model/pages_category');

var PagesProto = {
	'getAllPages': function (req, callback) {
		PagesModel
			.find({})
			.populate('category')
			.exec(function (err, pages) {
				callback(pages);
			});
	},

	// find all
	'getAllCategory': function (req, callback) {
		PagesCategoryModel
			.find()
			.populate('pages')
			.exec(function (err, pagesCats) {
				callback(pagesCats);
			});
		// PagesCategoryModel
		// 	.update({_id:'56d2a1a7785da88408e49d92'}, {pages: []}, function (err, pagesCats) {
		// 		callback(pagesCats);
		// 	});
	},

	'getPages': function (req, callback) {
		PagesModel
			.find({category: req.body.category_id})
			.populate('category')
			.exec(function (err, pages) {
				callback(pages);
			});
	},

	'getPagesWithoutContent': function (req, callback) {
		PagesModel
			.find()
			.select('abbr title category')
			.exec(function (err, pages) {
				callback(pages);
			});
	},

	'getPage': function (req, callback) {
		PagesModel
			.findOne({abbr: req.body.abbr})
			.populate({
				path: 'category',
				populate: {
					path: 'pages._id'
				}
			})
			.exec(function (err, page) {
				if(page==null) {
					callback({ notfound: true });
				} else {
					callback(page);
				}
			});
	},

	// create cat
	'addCategory': function (req, callback) {
		PagesCategoryModel.count({}, function (err, count) {
			var newCat = new PagesCategoryModel();
			newCat.name = req.body.name;
			newCat.order = count;
			newCat.save(function (err, category) {
				callback(category);
			});
		});
	},

	'editCategory': function (req, callback) {
		PagesCategoryModel
			.update({_id: req.body.category_id},
					{name: req.body.name}, 
					function (err, category) {
						callback(category);
					});
	},

	'removeCategory': function (req, callback) {
		PagesCategoryModel
			.remove({_id: req.body.category_id}, 
					function (err, category) {
						callback(category);
					});
	},

	'addPage': function (req, callback) {
		var newPage = new PagesModel();
		newPage.abbr = req.body.abbr;
		newPage.title = req.body.title;
		newPage.content = req.body.content;
		newPage.category = req.body.category_id;
		newPage.save(function (err, page) {
			if(page) {
				// push the id of the new page into our category model.
				PagesCategoryModel
					.update({_id: req.body.category_id},
							{$push: {pages: [page._id]}},
							function (err, category) {
								callback(category);
							});
			} else {
				callback({msg: 'nope'});
			}
		});
	},

	'editPage': function (req, callback) {
		PagesModel
			.update(
				{_id: req.body.page_id},
				{abbr: req.body.abbr,
				 title: req.body.title,
				 content: req.body.content,
				 category: req.body.category_id},
				function (err, page) {
					PagesCategoryModel.find({pages: [req.body.page_id]}, function (err,pageCat) {
						// check category
						if (pageCat._id != req.body.category_id) {
							// category changed, pull out page id then push in new category
							PagesCategoryModel
								.update(
									{_id: pageCat._id},
									{$pull: {pages: [req.body.page_id]}},
									function (err, pageCat) {
										PagesCategoryModel
											.update(
												{_id: req.body.category_id},
												{$push: {pages: [req.body.page_id]}},
												function (err, pageCat) {
													callback(pageCat);
												});
									});
						} else {
							// category didn't change, do nothing
							callback();
						}
					});
				});
	},

	'removePage': function (req, callback) {
		PagesModel
			.remove({_id: req.body.page_id}, function (err, page) {
				PagesCategoryModel
					.update(
						{pages: req.body.page_id},
						{$pull: {pages: [req.body.page_id]}},
						function (err, category) {
							callback(category);
						});
			});
	}

}

function Pages () {
	// init ...
}

Pages.prototype = PagesProto;

module.exports = Pages;