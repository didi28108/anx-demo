/* 消息公告類別schema */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NewsCategorySchema = mongoose.Schema({
  name    : { type: String },   // 類別名稱
  order   : { type: Number },   // 類別排序(目前沒有使用)
  news    : [{ type: Schema.Types.ObjectId, ref: 'News', default: null }]   // 類別下的公告_id
});

module.exports = mongoose.model('NewsCategory', NewsCategorySchema);
