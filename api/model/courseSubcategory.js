var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// 課程子類別
var CourseSubcategorySchema = new Schema({
  name        : String,     // 名稱
  createDate  : Date,
  updateDate  : Date
});

module.exports = mongoose.model('CourseSubcategory', CourseSubcategorySchema);