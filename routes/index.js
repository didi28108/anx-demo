var jwt = require('jwt-simple');

var User = require('../api/model/user');

var config = require('../config/db_conn');

module.exports = function (app, passport, root_dir) {

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
					res.json({success: true, msg: 'Welcome, ' + user.name + '!'});
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