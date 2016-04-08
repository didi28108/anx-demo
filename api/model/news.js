var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// 課程類別
var NewsSchema = mongoose.Schema({
	title		: { type: String },
	content		: { type: String },
	startdate 	: { type: Date },
	enddate		: { type: Date },
	pintotop	: { type: Boolean },
	createdate	: { type: Date },
	category	: { type: Schema.Types.ObjectId, ref: 'NewsCategory' },
	clicks		: { type: Number, default: 0 }
});

module.exports = mongoose.model('News', NewsSchema);
