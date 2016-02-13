var config = require('../config/db_conn');

var NewsModel = require('./model/news');
var NewsCategoryModel = require('./model/news_category');

var NewsProto = {

// news category 's CRUD method

	'findAllCategory': function(req, callback) {
		NewsCategoryModel.find({}, function (err, categories) {
			callback(categories);
		});
	},

	'addCategory': function(req, callback) {
		var newCat = new NewsCategoryModel();
		newCat.name = req.body.name;
		newCat.save(function (err, categories) {
			callback(categories);
		});
	},

	'updateCategory': function(req, callback) {
		NewsCategoryModel
			.update(
				{ _id: req.body.category_id },
				{ name: req.body.name },
				function (err, categories) {
					callback(categories);
				});
	},

	'removeCategory': function(req, callback) {
		NewsCategoryModel
			.remove(
				{ _id: req.body.category_id },
				function (err, categories) {
					callback(categories);
				});
	},


// news' CRUD method

	'findOne': function(req, callback) {
		NewsModel
			.find({ _id: req.body.news_id })
			.populate('category')
			.exec(function (err, news) {
				if(news==null) {
					callback({ notfound: true });
				} else {
					callback(news);
				}
		});
	},

	'findAll': function(req, callback) {
		NewsModel
			.find({})
			.populate('category')
			.sort('-createdate')
			.exec(function (err, news) {
			callback(news);
		});
	},

	'add': function(req, callback) {

		Date.prototype.addHours = function(h) {    
			this.setTime(this.getTime() + (h*60*60*1000)); 
			return this;   
		};
		var current_date = new Date();
		current_date.addHours(config.timeZoneDiff);

		var newNews = new NewsModel();
		newNews.title 		= req.body.title;
		newNews.content 	= req.body.content;
		newNews.startdate = req.body.startdate;
		newNews.enddate		= req.body.enddate;
		// newNews.pintotop	= req.body.pintotop;
		newNews.category 	= req.body.category_id;
		newNews.createdate = current_date;

		newNews.save(function (err, news) {
			NewsCategoryModel
				.update(
					{ _id: req.body.category_id },
					{	$push: {news: [ news._id ]}},
					function (err, newsCategory) {
						callback(newsCategory);
				});
		});
	},

	'update': function(req, callback) {
		NewsModel
			.update(
				{ _id: req.body.news_id },
				{ title 		: req.body.title,
					content 	: req.body.content,
					startdate : req.body.startdate,
					enddate		: req.body.enddate,
					category 	: req.body.category_id,
					// pintotop	: req.body.pintotop 
				},
				function (err, news) {
					callback(news);
			});
	},

	'remove': function (req, callback) {
		NewsModel.remove({ _id: req.body.news_id }, function (err, news) {
			NewsCategoryModel
				.update(
					{ news: [ req.body.news_id ] },
					{ $pull: { news: [req.body.news_id] } },
					function (err, newsCategory) {
						callback(newsCategory);
				});
		});
	},

	'addClick': function(req, callback) {
		NewsModel
			.update({ _id: req.body.news_id },
							{ $inc: { clicks: 1 }},
							function (err, news) {
								callback(news);
			});
	}


}


function News(){
	// initial ...
};
News.prototype = NewsProto;
module.exports = News;