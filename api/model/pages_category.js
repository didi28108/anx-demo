var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// 內容頁面類別
var PageCategorySchema = new Schema({
  name    : { type: String },     // 類別名稱
  pages   : [{
    type: Schema.Types.ObjectId,  // 類別下的頁面_id
    ref : 'Page'
  }],
  order   : { type: Number, unique: true }  // 類別排序(目前沒有使用)
});

module.exports = mongoose.model('PageCategory', PageCategorySchema);
