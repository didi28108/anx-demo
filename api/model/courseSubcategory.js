/* 課程子類別schema */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CourseSubcategorySchema = new Schema({
  name        : String,     // 名稱
  createDate  : Date,       // 新增時間
  updateDate  : Date        // 更新時間
});

module.exports = mongoose.model('CourseSubcategory', CourseSubcategorySchema);