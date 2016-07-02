/*  課程子類別API
    使用的mongoose model:
      1. 課程子類別("ROOT/api/model/courseSubcategory")
      2. 課程("ROOT/api/model/course")
    API方法:
      1. create 新增課程子類別
      2. update 更新課程子類別
      3. remove 移除課程子類別
      4. getAll 取得所有課程子類別
      5. getAllWithCourseCount      取得所有課程子類別及課程數量計數
      6. getAllWithShownCourseCount 取得所有已顯示的課程子類別及課程數量計數
*/

// lodash for array mapping
var _ = require('lodash');

var SubcategoryModel = require('./model/courseSubcategory');
var CourseModel = require('./model/course');

var SubcategoryProto = {
  // 新增課程子類別
  'create': function (req, callback) {
    var newSubcat = new SubcategoryModel({
      name        : req.body.subcategory.name,
      createDate  : new Date()
    });
    newSubcat.save(function (err, subcategory) {
      if (err) {
        callback(
          {
            success: false,
            err: {
              name: err.name,
              msg: err.message,
              code: err.code
            }
          }
        );
      } else {
        callback({success: true});
      }
    });
  },

  // 更新課程子類別
  'update': function (req, callback) {
    SubcategoryModel
      .update({ _id: req.body.subcategory._id },
        {
          name        : req.body.subcategory.name,
          updateDate  : getCurrentDate()
        },
        function (err, subcategory) {
          if (err) {
            callback(
              {
                success: false,
                err: {
                  name: err.name,
                  msg: err.message,
                  code: err.code
                }
              }
            );
          } else {
            callback({success: true});
          }
        });
  },

  'remove': function (req, callback) {
    SubcategoryModel.remove({ _id: req.body.subcategory._id }, function (err, subcategory) {
      if (err) {
        callback(
          {
            success: false,
            err: {
              name: err.name,
              msg: err.message,
              code: err.code
            }
          }
        );
      } else {
        callback({success: true});
      }
    });
  },

  // 取得所有課程子類別
  'getAll': function (req, callback) {
    SubcategoryModel.find({}, function (err, subcategory) {
      callback(subcategory);
    });
  },

  // 取得所有課程子類別及課程數量計數
  'getAllWithCourseCount': function (req, callback) {
    SubcategoryModel
    .find({})
    .select('name')
    .exec(function (err, subcategory) {
      subcategoryNameArr = _.map(subcategory, function(e) { return e.name });
      CourseModel
      .find({subcategory: {$in: subcategoryNameArr}})
      .select('subcategory')
      .exec(function (err, courses) {
        callback(
          _.map(subcategory, function(e) {
            var e_clone = JSON.parse(JSON.stringify(e));
            e_clone.courseCount = _.size(_.filter(courses, { 'subcategory': [e_clone.name] }));
            return e_clone;
          })
        );
      });
    });
  },

  // 取得所有已顯示的課程子類別及課程數量計數
  'getAllWithShownCourseCount': function (req, callback) {
    SubcategoryModel
    .find({})
    .select('name')
    .exec(function (err, subcategory) {
      subcategoryNameArr = _.map(subcategory, function(e) { return e.name });
      CourseModel
      .find({subcategory: {$in: subcategoryNameArr}})
      .where({show:true})
      .select('subcategory')
      .exec(function (err, courses) {
        callback(
          _.map(subcategory, function(e) {
            var e_clone = JSON.parse(JSON.stringify(e));
            e_clone.courseCount = _.size(_.filter(courses, { 'subcategory': [e_clone.name] }));
            return e_clone;
          })
        );
      });
    });
  }
  
}


function Subcategory(){
  // initial ...
};

Subcategory.prototype = SubcategoryProto;

module.exports = Subcategory;