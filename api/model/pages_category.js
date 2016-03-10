var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// 課程類別
var PageCategorySchema = new Schema({
	name: { type: String },
	pages: [{
		type: Schema.Types.ObjectId,
		ref: 'Page'
	}]
});

module.exports = mongoose.model('PageCategory', PageCategorySchema);
