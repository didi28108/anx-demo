var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PageSchema = new Schema({
	title: { type: String },
	abbr: {	type: String, unique : true	},
	content: { type: String },
	category: { type: Schema.Types.ObjectId, ref: 'PageCategory'}
});

module.exports = mongoose.model('Page', PageSchema);
