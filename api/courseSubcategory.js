var _ = require('lodash');

var SubcategoryModel = require('./model/courseSubcategory');
var CourseModel = require('./model/course');

var SubcategoryProto = {
  'create': function (req, callback) {
    var newSubcat = new SubcategoryModel({
      name        : req.body.subcategory.name,
      createDate  : getCurrentDate()
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

  'getAll': function (req, callback) {
    SubcategoryModel.find({}, function (err, subcategory) {
      callback(subcategory);
    });
  },

  'getAllWithCourseCount': function (req, callback) {
    SubcategoryModel.find({}, function (err, subcategory) {
      subcategoryNameArr = _.map(subcategory, function(e) { return e.name });
      CourseModel
        .find({subcategory: {$in: subcategoryNameArr}})
        .select('subcategory')
        .exec(function (err, courses) {
          callback(
            _.map(subcategory, function(e) {
              var e_clone = JSON.parse(JSON.stringify(e));
              e_clone.courseCount = _.size(_.filter(courses,  _.matches({ 'subcategory': e_clone.name })));
              return e_clone;
            })
          );
      });
    });
  },

  'getAllWithShownCourseCount': function (req, callback) {
    SubcategoryModel.find({}, function (err, subcategory) {
      subcategoryNameArr = _.map(subcategory, function(e) { return e.name });
      CourseModel
        .find({subcategory: {$in: subcategoryNameArr}})
        .where({show:true})
        .select('subcategory')
        .exec(function (err, courses) {
          callback(
            _.map(subcategory, function(e) {
              var e_clone = JSON.parse(JSON.stringify(e));
              e_clone.courseCount = _.size(_.filter(courses,  _.matches({ 'subcategory': e_clone.name })));
              return e_clone;
            })
          );
      });
    });
  }
  
}

var getCurrentDate = function () {
  // Date.prototype.addHours = function(h) {    
  //   this.setTime(this.getTime() + (h*60*60*1000)); 
  //   return this;   
  // };
  // var current_date = new Date();
  // current_date.addHours(config.timeZoneDiff);
  // return current_date;

  var d = new Date();
  return d;
}


function Subcategory(){
  // initial ...
};

Subcategory.prototype = SubcategoryProto;

module.exports = Subcategory;