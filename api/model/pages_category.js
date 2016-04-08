var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// 課程類別
var PageCategorySchema = new Schema({
	name: { type: String },
	pages: [{
		type: Schema.Types.ObjectId,
		ref: 'Page'
	}],
	order: { type: Number, unique: true }
});

module.exports = mongoose.model('PageCategory', PageCategorySchema);
