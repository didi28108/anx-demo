/* 消息公告schema */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NewsSchema = mongoose.Schema({
  title       : { type: String },   // 公告名稱
  content     : { type: String },   // 公告內容
  createdate  : { type: Date },     // 新增時間
  category    : { type: Schema.Types.ObjectId, ref: 'NewsCategory' }, // 公告所屬類別的_id
  clicks      : { type: Number, default: 0 },   // 點閱量
  show        : Boolean             // 顯示狀態(true顯示/false隱藏)
});

module.exports = mongoose.model('News', NewsSchema);
