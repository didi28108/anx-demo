var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// 內容頁面
var PageSchema = new Schema({
  title     : { type: String },                   // 頁面標題
  abbr      : { type: String, unique : true  },   // 頁面縮寫(routing用)
  content   : { type: String },                   // 頁面內容
  category  : { type: Schema.Types.ObjectId, ref: 'PageCategory'}   // 頁面所屬類別的_id
});

module.exports = mongoose.model('Page', PageSchema);
