var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// 課程類別
var CategorySchema = new Schema({
	show: { type: Boolean, default: false },	// 顯示或隱藏
	class: { type: String },     				// 校內 or 政府單位
	deptCode: { type: String, unique: true },	// 單位代碼
	deptName: { type: String },  				// 單位名稱
	academic: { type: String },  				// 級別
	order: { type: Number, default: 0 },
	course: [{ type: Schema.Types.ObjectId, ref: 'Course'}]
});

module.exports = mongoose.model('Category', CategorySchema);
