var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// 課程類別
var CategorySchema = mongoose.Schema({
	name: { type: String },
	abbr: {	type: String, unique : true	},
	course: [{ type: Schema.Types.ObjectId, ref: 'Course', default: null }]
});

module.exports = mongoose.model('Category', CategorySchema);
