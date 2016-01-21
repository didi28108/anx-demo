var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
	name:  {
		type: String,
		unique: true,
		required: true
	},
	password: {
		type: String,
		required: true
	}
});

// not using bcrypt package due to npm install failure ...

module.exports = mongoose.model('User', UserSchema);