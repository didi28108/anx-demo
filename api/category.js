/*  課程類別API 
 *  使用的mongoose model:
 *    1. 課程("ROOT/api/model/course")
 *    2. 課程類別("ROOT/api/model/category")
 *  API方法:
 *    1. create         新增課程類別
 *    2. update         修改課程類別
 *    3. getAll         取得所有課程類別
 *    4. getShown       取得所有已顯示課程類別
 *    5. getShownWithShownCourseCount
 *      取得所有已顯示的課程類別,
 *      及類別所包含的"已顯示"課程課程的數量
 *    6. removeAll      移除所有類別
 *    7. pushCourse     將特定課程_id 新增到特定課程類別的課程_id陣列
 *    8. pullCourse     將特定課程_id 從特定課程類別的課程_id陣列中移除
 *    9. getPrevious    取得特定課程的類別
 *    10. createAllFromYuntech
 *      專用於
 *      將由報名繳費系統取得的雲科各單位資料
 *      一次新增到課程類別collection中
 */

var CourseModel = require('./model/course');
var CategoryModel = require('./model/category');

var CategoryProto = {
  // 新增課程類別
  'create': function (req, callback) {
    var newCat = new CategoryModel();
    newCat.class    = req.body.class;     // 校內單位或政府單位(目前已棄用)
    newCat.deptName = req.body.deptName;  // 單位名稱
    newCat.deptCode = req.body.deptCode;  // 單位代碼
    newCat.show     = req.body.show;      // 顯示狀態(Boolean)
    newCat.save(function (err, data) {
      if (err) {
        callback(
          {
            success: false,
            err: 
              { 
                name: err.name,
                msg: err.message,
                code: err.code
              }
          }
        );
      } else {
        callback({ success: true });
      }
    });
  },

  // 修改課程類別
  'update': function (req, callback) {
    CategoryModel
      .update(
        { _id: req.body.category_id },  // 使用類別_id查找
        {
          class     : req.body.class,     // 校內單位或政府單位(目前已棄用)
          deptName  : req.body.deptName,  // 單位名稱
          deptCode  : req.body.deptCode,  // 單位代碼
          show      : req.body.show       // 顯示狀態
        },
        function(err, data) {
          if (err) {
            callback(
              {
                success: false,
                err: 
                  { 
                    name: err.name,
                    msg: err.message,
                    code: err.code
                  }
              }
            );
          } else {
            callback({ success: true });
          }
      });
  },

  // 取得所有課程類別
  'getAll': function (req, callback) {
    CategoryModel
      .find({})
      .exec(function (err, data) {
      callback(data);                 // callback回傳查詢結果
    });
  },

  // 取得所有已顯示課程類別
  'getShown': function (req, callback) {
    CategoryModel
      .find({})
      .where({show: true})
      .exec(function (err, data) {
      callback(data);                 // callback回傳查詢結果
    });
  },

  // 取得所有已顯示的課程類別, 及類別所包含的"已顯示"課程課程的數量
  'getShownWithShownCourseCount': function (callback) {
    CategoryModel
      .find({})
      .where({show: true})   // 查詢條件: 顯示狀態為true的課程類別
      .exec(function (err, categories) {
        CourseModel
          .find({})
          .where({show: true})      // 查詢條件: 顯示狀態為true的課程
          .select('category show')  // 只取得課程類別field和顯示狀態field
          .sort('-createdate')      // 排序條件為課程新增日期DESC
          .exec(function (err, courses) {
            if (categories && courses) {
              var categoryClone = JSON.parse(JSON.stringify(categories));   // deep clone類別們
              for (var i = 0; i < courses.length ; i++) {
                if(courses[i].show) { // 顯示設定為true的在其對應category計數+1
                  for (var k = 0; k < categoryClone.length ; k++) {
                    if(courses[i].category == categoryClone[k]._id) {
                      if(categoryClone[k].shownCourseCount) categoryClone[k].shownCourseCount++; // 找到類別 類別的包含課程數量計數+1
                      else categoryClone[k].shownCourseCount = 1;   // 初始化 設定為1
                    }
                  }
                }
                if(i == courses.length - 1) {  // 尋訪至最後一個課程時callback 避免非同步問題
                  for (var k = 0; k < categoryClone.length ; k++) {
                    if(categoryClone[k].shownCourseCount == undefined) categoryClone[k].shownCourseCount = 0;
                    if(k == categoryClone.length - 1) {
                      callback(categoryClone);
                    }
                  }
                }
              }
            } else {
              callback({msg: "categories or courses is null!"});
            }
          });
    });
  },

  // 移除所有類別
  'removeAll': function (req, callback) {
    CategoryModel.remove({}, function (err, data) {
      callback(data);
    });
  },

  // 將特定課程_id 新增到特定課程類別的課程_id陣列
  'pushCourse': function (data, callback) {
    CategoryModel
      .update({ _id: data.category_id }, 
              {$push: {course: [data.course_id]}},
              function (err, course) {
                if (err) throw err;
                else callback(course);
              });
  },

  // 將特定課程_id 從特定課程類別的課程_id陣列中移除
  'pullCourse': function (data, callback) {
    CategoryModel
      .update({ course: [data.course_id] },
              {$pull: { course: [data.course_id]}},
              function (err, course) {
                if (err) throw err;
                else callback(course);
              });
  },

  // 取得特定課程的類別
  'getPrevious': function (data, callback) {
    CategoryModel.findOne({ course: [ data.course_id ] }, function (err, cat) {
      callback(cat);
    });
  },

  'createAllFromYuntech': function (data_arr, callback) {
    var categories = [];

    for (var i = data_arr.length - 1; i >= 0; i--) {
      var item = {
        class:    "雲科大",
        deptCode:  data_arr[i].DeptCode,
        deptName:  data_arr[i].DeptName,
        academic:  data_arr[i].Academic
      }
      categories.unshift(item);
      if (i==0) {
        CategoryModel.create(categories, function (err, data) {
          callback(data);
        });
      }
    }
  }
}


function Category(){
  // initial ...
};

Category.prototype = CategoryProto;

module.exports = Category;