var mongoose = require('mongoose');
var Schema = mongoose.Schema;
/* 課程資料的每一欄位皆不應為空值
 * 後續需加上 required: true
 */
var CourseSchema = new Schema({
	category: {
		type: Schema.Types.ObjectId,
		ref: 'Category'
	},
	no 						: { type: String },	// 課號
	name					: { type: String },
	startdate			: { type: Date },
	enddate				: { type: Date },
	confirmdate		: { type: Date }, // 課程確定開課與否之日期
	duration			: {	type: Number },
	time					: { type: String },
	area					: {	id: 	Number, 
										name: String },
	location			: {	type: String },
	enroll_target	: { type: String },	// 課程招生對象
	meal_offer		: {	type: Boolean	},
	price					: { type: Number },
	note					: {	type: String },	// 備註
	contact_info	: {	type: String },
	enroll_link		: {	type: String },
	clicks				: { type: Number, default: 0 },
	createdate		: Date
});

module.exports = mongoose.model('Course', CourseSchema);
