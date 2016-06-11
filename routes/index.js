var jwt = require('jwt-simple');
var request = require('request');
var config = require('../config/db_conn');

var User = require('../api/model/user');
var PagesApi = require('../api/pages');
var CourseApi = require('../api/course');
var CategoryApi = require('../api/category');
var SubcategoryApi = require('../api/courseSubcategory');
var NewsApi = require('../api/news');

var Pages = new PagesApi();
var Course = new CourseApi();
var Category = new CategoryApi();
var Subcategory = new SubcategoryApi();
var News = new NewsApi();

module.exports = function (app, passport, root_dir) {

	// pages routes
	app.get('/api/getPageCategory', function (req, res) {
		Pages.getAllCategory(req, function (data) {
			res.json(data);
		});
	});

	app.post('/api/addPageCategory', function (req, res) {
		if (checkHeaderAuth(req.headers)) {
			Pages.addCategory(req, function (data) {
				res.json(data);
			});
		} else {
			res.json({msg: "rejected"});
		}
	});

	app.post('/api/editPageCategory', function (req, res) {
		if (checkHeaderAuth(req.headers)) {
			Pages.editCategory(req, function (data) {
				res.json(data);
			});
		} else {
			res.json({msg: "rejected"});
		}
	});

	app.post('/api/removePageCategory', function (req, res) {
		if (checkHeaderAuth(req.headers)) {
			Pages.removeCategory(req, function (data) {
				res.json(data);
			});
		} else {
			res.json({msg: "rejected"});
		}
	});

	app.get('/api/getAllPages', function (req, res) {
		Pages.getAllPages(req, function (data) {
			res.json(data);
		});
	});

	app.get('/api/getPagesWithoutContent', function (req, res) {
		Pages.getPagesWithoutContent(req, function (data) {
			res.json(data);
		});
	});

	app.post('/api/getPages', function (req, res) {
		Pages.getPages(req, function (data) {
			res.json(data);
		});
	});

	app.post('/api/getPage', function (req, res) {
		Pages.getPage(req, function (data) {
			res.json(data);
		});
	});

	app.post('/api/addPage', function (req, res) {
		if (checkHeaderAuth(req.headers)) {
			Pages.addPage(req, function (data) {
				res.json(data);
			});
		} else {
			res.json({msg: "rejected"});
		}
	});

	app.post('/api/editPage', function (req, res) {
		if (checkHeaderAuth(req.headers)) {
			Pages.editPage(req, function (data) {
				res.json(data);
			});
		} else {
			res.json({msg: "rejected"});
		}
	});

	app.post('/api/removePage', function (req, res) {
		if (checkHeaderAuth(req.headers)) {
			Pages.removePage(req, function (data) {
				res.json(data);
			});
		} else {
			res.json({msg: "rejected"});
		}
	});

	// news category related routes
	app.get('/api/getNewsCategory', function (req, res) {
		News.findAllCategory(req, function (data) {
			res.json(data);
		});
	});

	app.post('/api/addNewsCategory', function (req, res) {
		if (checkHeaderAuth(req.headers)) {
			News.addCategory(req, function (data) {
				res.json(data);
			});
		} else {
			res.json({msg: "rejected"});
		}
	});

	app.post('/api/updateNewsCategory', function (req, res) {
		if (checkHeaderAuth(req.headers)) {
			News.updateCategory(req, function (data) {
				res.json(data);
			});
		} else {
			res.json({msg: "rejected"});
		}
	});

	app.post('/api/removeNewsCategory', function (req, res) {
		if (checkHeaderAuth(req.headers)) {
			News.removeCategory(req, function (data) {
				res.json(data);
			});
		} else {
			res.json({msg: "rejected"});
		}
	});

	app.get('/api/countShownNews', function (req, res) {
		News.countShown(function (data) {
			res.json(data);
		});
	});

	// news related routes
	app.post('/api/getNews', function (req, res) {
		News.findOne(req, function (data) {
			res.json(data);
		});
	});

	app.get('/api/getAllNews', function (req, res) {
		News.findAll(req, function (data) {
			res.json(data);
		});
	});

	app.get('/api/getAllShownNews', function (req, res) {
		News.findAllShown(function (data) {
			res.json(data);
		});
	});

	app.get('/api/getTenNews', function (req, res) {
		News.findTen(req, function (data) {
			res.json(data);
		});
	});

	app.post('/api/addNews', function (req, res) {
		if (checkHeaderAuth(req.headers)) {
			News.add(req, function (data) {
				res.json(data);
			});
		} else {
			res.json({msg: "rejected"});
		}
	});

	app.post('/api/updateNews', function (req, res) {
		if (checkHeaderAuth(req.headers)) {
			News.update(req, function (data) {
				res.json(data);
			});
		} else {
			res.json({msg: "rejected"});
		}
	});

	app.post('/api/newsSetShow', function (req, res) {
		if (checkHeaderAuth(req.headers)) {
			News.show(req, function (data) {
				res.json(data);
			});
		} else {
			res.json({msg: "rejected"});
		}
	});

	app.post('/api/removeNews', function (req, res) {
		if (checkHeaderAuth(req.headers)) {
			News.remove(req, function (data) {
				res.json(data);
			});
		} else {
			res.json({msg: "rejected"});
		}
	});

	app.post('/api/newsClicked', function (req, res) {
		News.addClick(req, function (data) {
			res.json(data);
		});
	});


	// course category
	app.get('/api/getCourseCategory', function (req, res) {
		Category.getAll(req, function (data) {
			res.json(data);
		});
	});

	app.get('/api/getShownCourseCategory', function (req, res) {
		Category.getShownWithShownCourseCount(function (data) {
			res.json(data);
		});
	});

	app.post('/api/addCourseCategory', function (req, res) {
		if (checkHeaderAuth(req.headers)) {
			Category.create(req, function (data) {
				res.json(data);
			});
		} else {
			res.json({msg: "rejected"});
		}
	});

	app.post('/api/editCourseCategory', function (req, res) {
		if (checkHeaderAuth(req.headers)) {
			Category.update(req, function (data) {
				res.json(data);
			});
		} else {
			res.json({msg: "rejected"});
		}
	});

	app.get('/api/removeAllCats', function (req, res) {
		if (checkHeaderAuth(req.headers)) {
			Category.removeAll(req, function (data) {
				res.json(data);
			});
		} else {
			res.json({msg: "rejected"});
		}
	});

	// POST course data from Yuntech
	app.post('/getCourseDataFromYuntech', function (req, res) {
		if (req.body.year != undefined && req.body.no != undefined) {
			request({
				"rejectUnauthorized": false,
				"url": 'https://webapp.yuntech.edu.tw/CRISWeb/CRISService/GetCourseData',
				"method": "POST",
				"form": {
					"pCourseYear": req.body.year,
					"pCourseId": req.body.no
				}
			}, function (error, response, body) {
				if(!error && response.statusCode == 200) {
					res.json(JSON.parse(body));
				} else if (!error && response.statusCode == 500) {
					res.json({msg: "查無此課程"});
				} else {
					res.json({msg: "連線失敗，請稍後再試"});
				}
			});
		} else {
			res.json({msg: "rejected"});
		}
	});

	// GET all categories from Yuntech then save them in local db
	app.post('/api/createAllCategoriesFromYuntech', function (req, res) {
		if (req.body.auth) {
			// GET category data from Yuntech
			request({
				"rejectUnauthorized": false,
				"url": 'https://webapp.yuntech.edu.tw/CRISWeb/CRISService/GetDepartmentDataList',
				"method": "GET"
			}, function (error, response, body) {
				if (response.statusCode == 200) {
					var parsed_data = JSON.parse(body).data;
					Category.createAllFromYuntech(parsed_data, function (data) {
						res.json(data);
					});
				}
			});
		} else {
			res.json({msg: "rejected"});
		}
	});

	// course subcategory 
	app.get('/api/getCourseSubcategoryList', function (req, res) {
		Subcategory.getAll(req, function (data) {
			res.json(data);
		});
	});

	app.get('/api/getCourseSubcategoryListWithCourseCount', function (req, res) {
		Subcategory.getAllWithCourseCount(req, function (data) {
			res.json(data);
		});
	});

	app.get('/api/getCourseSubcategoryListWithShownCourseCount', function (req, res) {
		Subcategory.getAllWithShownCourseCount(req, function (data) {
			res.json(data);
		});
	});

	app.post('/api/addCourseSubcategory', function (req, res) {
		if (checkHeaderAuth(req.headers)) {
			Subcategory.create(req, function (data) {
				res.json(data);
			});
		} else {
			res.json({msg: "rejected"});
		}
	});

	app.post('/api/editCourseSubcategory', function (req, res) {
		if (checkHeaderAuth(req.headers)) {
			Subcategory.update(req, function (data) {
				res.json(data);
			});
		} else {
			res.json({msg: "rejected"});
		}
	});

	app.post('/api/removeCourseSubcategory', function (req, res) {
		if (checkHeaderAuth(req.headers)) {
			Subcategory.remove(req, function (data) {
				res.json(data);
			});
		} else {
			res.json({msg: "rejected"});
		}
	});	

	// course
	app.get('/api/getPopularCourse', function (req, res) {
		Course.getPopular(req, function (data) {
			res.json(data);
		});
	});

	app.get('/api/getPinTopCourse', function (req, res) {
		Course.getPinTop(req, function (data) {
			res.json(data);
		});
	});

	app.get('/api/getAllCourse', function (req, res) {
		Course.getAll(req, function (data) {
			res.json(data);
		});
	});

	app.get('/api/getAllShownCourse', function (req, res) {
		Course.getAllShown(function (data) {
			res.json(data);
		});
	});

	app.post('/api/getCourse', function (req, res) {
		Course.getOne(req, function (data) {
			res.json(data);
		});
	});
	
	app.post('/api/addCourse', function (req, res) {
		if (checkHeaderAuth(req.headers)) {
			Course.create(req, function (data) {
				res.json(data);
			});
		} else {
			res.json({msg: "rejected"});
		}
	});

	app.post('/api/updateCourse', function (req, res) {
		if (checkHeaderAuth(req.headers)) {
			Course.update(req, function (data) {
				res.json(data);
			});
		} else {
			res.json({msg: "rejected"});
		}
	});

	app.post('/api/updateCourseState', function (req, res) {
		if (checkHeaderAuth(req.headers)) {
			Course.updateState(req, function (data) {
				res.json(data);
			});
		} else {
			res.json({msg: "rejected"});
		}
	});

	app.post('/api/coursePinTop', function (req, res) {
		if (checkHeaderAuth(req.headers)) {
			Course.pinTop(req, function (data) {
				res.json(data);
			});
		} else {
			res.json({msg: "rejected"});
		}
	});

	app.post('/api/courseSetShow', function (req, res) {
		if (checkHeaderAuth(req.headers)) {
			Course.show(req, function (data) {
				res.json(data);
			});
		} else {
			res.json({msg: "rejected"});
		}
	});

	app.post('/api/removeCourse', function (req, res) {
		if (checkHeaderAuth(req.headers)) {
			Course.removeOne(req, function (data) {
				res.json(data);
			});
		} else {
			res.json({msg: "rejected"});
		}
	});

	app.get('/api/removeAllCourse', function (req, res) {
		Course.removeAll(req, function (data) {
			res.json(data);
		});
	});

	// 課程點擊次數+1
	app.post('/api/courseClicked', function (req, res) {
		Course.addClick(req, function (data) {
			res.json(data);
		});
	});

	// authentication related
	app.post('/api/signup', function (req, res) {
		if (!req.body.name || !req.body.password) {
			res.json({success: false, msg: 'Please pass name and password.'});
		} else {
			var newUser = new User({
				name: req.body.name,
				password: req.body.password
			});
			newUser.save(function (err) {
				if (err) {
					console.log(err);
					res.json({success: false, msg: 'User already exists.'});
				} else {
					res.json({success: true, msg: 'User created.'});
				}
			})
		}
	});

	app.post('/api/authenticate', function (req, res) {
		User.findOne({
			name: req.body.name
		}, function (err, user) {
			if (err) throw err;

			if (!user) {
				// return res.status(403).send({success: false, msg: 'User not found.'});
				res.json({success: false, msg: 'User not found.'});
			} else {
				if (user.password == req.body.password) {
					// create json web token
					var token = jwt.encode(user, config.secret);
					res.json({success: true, token: 'JWT ' + token});
				} else {
					// return res.status(403).send({success: false, msg: 'Wrong password.'});
					res.json({success: false, msg: 'Wrong password.'});
				}
			}
		})
	});

	app.get('/api/userinfo', passport.authenticate('jwt', {session: false}), function (req, res) {
		var token = getToken(req.headers);
		if (token) {
			var decoded = jwt.decode(token, config.secret);
			User.findOne({
				name: decoded.name
			}, function (err, user) {
				if (err) throw err;

				if (!user) {
					return res.status(403).send({success: false, msg: 'Authentication failed.'});
				} else {
					// return res.status(403).send({success: true, msg: 'Welcome, ' + user.name + '!'});
					res.json({success: true, name: user.name });
				}
			})
		} else {
			return res.status(403).send({success: false, msg: 'No token provided.'});
		}
	});

	app.use('*', function (req, res) {
		res.sendFile(root_dir + '/public/index.html');
	});
}

function getToken (headers) {
	if (headers && headers.authorization) {
		var parted = headers.authorization.split(' ');
		if (parted.length === 2) {
			return parted[1];
		} else {
			return null;
		}
	} else {
		return null;
	}
}

function checkHeaderAuth (headers) {
	if (headers && headers.authorization) {
		var parted = headers.authorization.split(' ');
		if (parted[0] == "JWT") {
			return true;
		} else {
			return false;
		}
	} else {
		return false;
	}
}