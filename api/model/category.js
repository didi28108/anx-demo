/* 課程類別schema */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CategorySchema = new Schema({
  show      : { type: Boolean, default: false },  // 顯示或隱藏
  class     : { type: String },                   // 校內單位或政府單位(目前已棄用)
  deptCode  : { type: String, unique: true },     // 單位代碼(例:ANX, TCX)
  deptName  : { type: String },                   // 單位名稱(例:推廣教育中心, 資訊中心)
  academic  : { type: String },                   // 級別(例:0, 1, 2)
  order     : { type: Number, default: 0 },       // 排序(目前沒有使用)
  course    : [{ type: Schema.Types.ObjectId, ref: 'Course'}] // 類別之下的課程_id, 參照Course collection
});

module.exports = mongoose.model('Category', CategorySchema);
