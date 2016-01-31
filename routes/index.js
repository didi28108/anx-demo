var jwt = require('jwt-simple');
var config = require('../config/db_conn');

var User = require('../api/model/user');
var CourseApi = require('../api/course');
var CategoryApi = require('../api/category');
var NewsApi = require('../api/news');

var Course = new CourseApi();
var Category = new CategoryApi();
var News = new NewsApi();


module.exports = function (app, passport, root_dir) {

// news category related routes
	app.get('/api/getNewsCategory', function (req, res) {
		News.findAllCategory(req, function (data) {
			res.json(data);
		});
	});

	app.post('/api/addNewsCategory', function (req, res) {
		News.addCategory(req, function (data) {
			res.json(data);
		});
	});

	app.post('/api/updateNewsCategory', function (req, res) {
		News.updateCategory(req, function (data) {
			res.json(data);
		});
	});

	app.post('/api/removeNewsCategory', function (req, res) {
		News.removeCategory(req, function (data) {
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

	app.post('/api/addNews', function (req, res) {
		News.add(req, function (data) {
			res.json(data);
		});
	});

	app.post('/api/updateNews', function (req, res) {
		News.update(req, function (data) {
			res.json(data);
		});
	});

	app.post('/api/removeNews', function (req, res) {
		News.remove(req, function (data) {
			res.json(data);
		});
	});


	// course category
	app.get('/api/getCategory', function (req, res) {
		Category.getAll(req, function (data) {
			res.json(data);
		});
	});

	app.post('/api/addCategory', function (req, res) {
		Category.create(req, function (data) {
			res.json(data);
		});
	});

	app.get('/api/removeAllCats', function (req, res) {
		Category.removeAll(req, function (data) {
			res.json(data);
		});
	});



	// course
	app.get('/api/getAllCourse', function (req, res) {
		Course.getAll(req, function (data) {
			res.json(data);
		});
	});

	app.post('/api/getCourse', function (req, res) {
		Course.getOne(req, function (data) {
			res.json(data);
		});
	});
	
	app.post('/api/addCourse', function (req, res) {
		Course.create(req, function (data) {
			res.json(data);
		});
	});

	app.post('/api/updateCourse', function (req, res) {
		Course.update(req, function (data) {
			res.json(data);
		});
	});

	app.post('/api/removeCourse', function (req, res) {
		Course.removeOne(req, function (data) {
			res.json(data);
		});
	});

	app.get('/api/removeAllCourse', function (req, res) {
		Course.removeAll(req, function (data) {
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