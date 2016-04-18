var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// 課程類別
var NewsSchema = mongoose.Schema({
	title		: { type: String },
	content		: { type: String },
	createdate	: { type: Date },
	category	: { type: Schema.Types.ObjectId, ref: 'NewsCategory' },
	clicks		: { type: Number, default: 0 },
	show		: Boolean
});

module.exports = mongoose.model('News', NewsSchema);
