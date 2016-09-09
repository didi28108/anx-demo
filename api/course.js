/*  課程API
    使用的mongoose model:
      課程("ROOT/api/model/course")
    使用的API
      課程類別("ROOT/api/category")
    API方法:
      1. create       新增課程
      2. update       更新課程
      3. updateState  更新課程狀態(開課, 未處理, 確定開課)
      4. getAll       查找所有課程
      5. getAllShown  查找所有已顯示的課程
      6. getOne       查找一個課程
      7. getPopular   查找熱門課程
      8. getPinTop    查找推薦課程
      9. removeOne    移除一個課程
      10. removeAll   移除所有課程
      11. addClick    點閱量+1
      12. pinTop      更新推薦狀態(推薦, 無推薦)
      13. show        更新顯示狀態
*/

// mongodb config
var config = require('../config/db_conn');

var CourseModel = require('./model/course');
var CategoryApi = require('./category');
var Category = new CategoryApi();

Date.prototype.addHours = function(h) {    
  this.setTime(this.getTime() + (h*60*60*1000)); 
  return this;
};

var CourseProto = {

  // 新增課程
  'create': function(req, callback) {

    // 課程開始日期
    var SD = new Date(req.body.course.startDate);

    // 課程結束日期
    var ED = new Date(req.body.course.endDate);

    // 開課確認日期
    var CD = new Date(req.body.course.confirmDate);

    // 開課截止日
    var EnrollDueD = new Date(req.body.course.enrollDueDate);

    // 開始時間
    var ST = new Date(req.body.course.startTime);
    ST = ST.toString().substring(16,21);

    // 結束時間
    var ET = new Date(req.body.course.endTime);
    ET = ET.toString().substring(16,21);

    console.log(req.body.course.subcategory);

    var newCourse = new CourseModel();
    newCourse.category      = req.body.course.category;       // 類別_id
    newCourse.subcategory   = req.body.course.subcategory;    // 子類別名稱
    newCourse.year          = req.body.course.year;           // 年
    newCourse.no            = req.body.course.no;             // 序號
    newCourse.fullNo        = req.body.course.fullNo;         // 課號
    newCourse.name          = req.body.course.name;           // 課程名稱
    newCourse.info          = req.body.course.info;           // 課程資訊
    newCourse.goal          = req.body.course.goal;           // 課程目標
    newCourse.lecturerInfo  = req.body.course.lecturerInfo;   // 講師資訊
    newCourse.startDate     = SD;                             // 開始日期
    newCourse.endDate       = ED;                             // 結束日期
    newCourse.startTime     = ST;                             // 開始時間
    newCourse.endTime       = ET;                             // 結束時間
    newCourse.location      = req.body.course.location;       // 上課地點
    newCourse.confirmDate   = CD;                             // 開課確認日期
    newCourse.enrollDueDate = EnrollDueD;                     // 報名截止日期
    newCourse.enrollTarget  = req.body.course.enrollTarget;   // 招生對象
    newCourse.launchOffer   = req.body.course.launchOffer;    // 午餐供應
    newCourse.price         = req.body.course.price;          // 課程原價
    newCourse.state         = req.body.course.state;          // 課程狀態
    newCourse.maxEnroll     = req.body.course.maxEnroll;      // 報名人數限制
    newCourse.remark        = req.body.course.remark;         // 備註
    newCourse.helpline      = req.body.course.helpline;       // 諮詢專線
    newCourse.area          = req.body.course.area;           // 地區
    newCourse.enrollLink    = req.body.course.enrollLink;     // 報繳費系統連結
    newCourse.clicks        = 0;                              // 點閱量
    newCourse.pinTop        = req.body.course.pinTop;         // 推薦狀態
    newCourse.show          = req.body.course.show;           // 顯示狀態
    newCourse.createDate    = new Date();                     // 建立日期

    // save course
    newCourse.save(function (err, data) {
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

      }  else {

        // after the course was successfully created,
        // push course _id into category's course field
        var course_data = {
          course_id    : data._id,
          category_id    : data.category
        };
        Category.pushCourse(course_data, function (data) {
          callback({success: true});
        });

      }
    });
      
  },

  // 更新課程
  'update': function(req, callback) {

    var SD = new Date(req.body.course.startDate);
    var ED = new Date(req.body.course.endDate);
    var CD = new Date(req.body.course.confirmDate);
    var EnrollDueD = new Date(req.body.course.enrollDueDate);
    var ST = new Date(req.body.course.startTime);
    ST = ST.toString().substring(16,21);
    var ET = new Date(req.body.course.endTime);
    ET = ET.toString().substring(16,21);

    CourseModel
      .update({ _id: req.body.course._id }, 
          { 
            category      : req.body.course.category,
            $set: { subcategory : req.body.course.subcategory },
            year          : req.body.course.year,
            no            : req.body.course.no,
            fullNo        : req.body.course.fullNo,
            name          : req.body.course.name,
            info          : req.body.course.info,
            goal          : req.body.course.goal,
            lecturerInfo  : req.body.course.lecturerInfo,
            startDate     : SD,
            endDate       : ED,
            startTime     : ST,
            endTime       : ET,
            location      : req.body.course.location,
            confirmDate   : CD,
            enrollDueDate : EnrollDueD,
            enrollTarget  : req.body.course.enrollTarget,
            launchOffer   : req.body.course.launchOffer,
            price         : req.body.course.price,
            state         : req.body.course.state,
            maxEnroll     : req.body.course.maxEnroll,
            remark        : req.body.course.remark,
            helpline      : req.body.course.helpline,
            area          : req.body.course.area,
            enrollLink    : req.body.course.enrollLink,
            pinTop        : req.body.course.pinTop,
            show          : req.body.course.show
          }, 
          function (err, course) {
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

            }  else {

              // 確認課程所屬類別有無改變
              // 若有改變則將課程_id從原類別的課程_id欄位中移除
              // 若無改變則不作任何更動

              // get previous category of the course
              Category.getPrevious({course_id: req.body.course._id}, function (previousCategory) {
                // check whether the course category has changed
                if (req.body.course.category != previousCategory._id) {
                  // pull course id from previous category.course[]
                  var course_data = {
                    course_id      : req.body.course._id
                  };
                  Category.pullCourse(course_data, function (data) {
                    // push course id into new category.course[]
                    var course_data = {
                      course_id    : req.body.course._id,
                      category_id    : req.body.course.category
                    };
                    Category.pushCourse(course_data, function (data) {
                      callback({success: true});
                    });
                  });
                } else {
                  callback({success: true});
                }
              });

            }
        });
  },

  // 更新課程狀態(開課, 未處理, 確定開課)
  'updateState': function (req, callback) {
    CourseModel
      .update(
        { _id: req.body.course._id },       // 使用課程_id查找
        { state: req.body.course.state },   // 更新狀態
        function (err, data) {
          callback(data);
      });
  },

  // 查找所有課程
  'getAll': function(req, callback) {
    CourseModel
      .find()
      .populate('category')   // populate(aka "join" in ORM) 課程類別collection
      .select('fullNo category subcategory area name startDate endDate confirmDate state clicks pinTop show')
      .sort('-createDate')
      .exec(function (err, data) {
        callback(data);
      });
  },

  // 查找所有已顯示的課程
  'getAllShown': function (callback) {
    CourseModel
      .find()
      .where({show: true})    // 查詢條件: 顯示狀態為true的課程
      .sort('-createDate')
      .populate('category')   // populate(aka "join" in ORM) 課程類別collection
      .select('category subcategory area name startDate endDate confirmDate state clicks pinTop show')
      .exec(function (err, data) {
        callback(data);
      });
  },

  // 查找一個課程
  'getOne': function(req, callback) {
    CourseModel
      .findOne({_id: req.body.course_id})   // 使用課程_id查找
      .populate('category')                 // populate(aka "join" in ORM) 課程類別collection
      .exec(function (err, data) {
        if(data==null) {
          callback({notfound: true});
        } else {
          callback(data);
        }
      });
  },

  // 查找熱門課程: 查找報名未截止, 點閱量最高的前7筆課程
  'getPopular': function (req, callback) {
    CourseModel
      .find({show: true})
      .populate('category')
      .where('enrollDueDate').gt(new Date(new Date().getTime() - 86400000 * 3))
      .select('category area name startDate endDate confirmDate state clicks pinTop')
      .sort('-clicks')
      .limit(7)
      .exec(function (err, data) {
        callback(data);
      });
  },

  // 查找熱門課程: 查找開課確認日後3天之前, 點閱量最高的前7筆課程
  'getPopular': function (req, callback) {
    CourseModel
      .find({show: true})
      .populate('category')
      .where('enrollDueDate').gt(new Date(new Date().getTime() - 86400000 * 3))
      .select('category area name startDate endDate confirmDate state clicks pinTop')
      .sort('-clicks')
      .limit(7)
      .exec(function (err, data) {
        callback(data);
      });
  },

  // 移除一個課程
  'removeOne': function(req, callback) {
    // 使用課程_id查找
    CourseModel.remove({ _id: req.body.course_id }, function (err, data) {
      if (err) throw err;
      else {
        var course_data = {
          category_id    : req.body.category_id,
          course_id    : req.body.course_id
        };
        // 從課程類別的課程_id欄位中移除該課程_id
        Category.pullCourse(course_data, function (data) {
          callback(data);
        });
      }
    });
  },

  // 移除所有課程
  'removeAll': function(req, callback) {
    CourseModel.remove({}, function (err, data) {
      callback(data);
    });
  },

  // 點閱量+1
  'addClick': function(req, callback) {
    CourseModel
      .update(
        { _id: req.body.course_id },    // 使用課程_id查找
        { $inc: { clicks: 1 }},         // 點閱量+1
        function (err, course) {
          callback(course);
      });
  },

  // 更新推薦狀態(推薦, 無推薦)
  'pinTop': function (req, callback) {
    CourseModel
      .update(
        {_id: req.body.course._id},       // 使用課程_id查找
        {pinTop: req.body.course.pinTop}, // 更新推薦(true, false)
        function (err, course) {
          callback(course);
        }
      );
  },

  // 更新顯示狀態
  'show': function (req, callback) {
    CourseModel
      .update(
        {_id: req.body.course._id},     // 使用課程_id查找
        {show: req.body.course.show},   // 更新顯示(true, false)
        function (err, course) {
          callback(course);
        }
      );
  }

}


function Course(){
  // initial ...
};
Course.prototype = CourseProto;

module.exports = Course;