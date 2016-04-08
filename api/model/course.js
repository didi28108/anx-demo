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
	year 			: Number,
	no 				: String,	// 課號
	fullNo			: { type: String, unique: true },
	name			: String,
	startDate		: Date,
	endDate			: Date,
	startTime		: String,
	endTime			: String,
	location		: String,
	confirmDate		: Date, // 課程確定開課與否之日期
	enrollDueDate	: Date,
	enrollTarget	: String,	// 課程招生對象
	launchOffer		: String,
	price			: Number,
	state 			: String,
	maxEnroll		: Number,
	remark			: String,	// 備註
	helpline		: String,
	area			: String,
	enrollLink		: String,
	clicks			: { type: Number, default: 0 },
	pinTop			: { type: Boolean },
	createDate		: Date,
	updateDate		: Date
});

module.exports = mongoose.model('Course', CourseSchema);
