var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// 課程類別
var NewsCategorySchema = mongoose.Schema({
	name: { type: String },
	news: [{ type: Schema.Types.ObjectId, ref: 'News', default: null }]
});

module.exports = mongoose.model('NewsCategory', NewsCategorySchema);
