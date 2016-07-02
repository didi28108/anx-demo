/*  頁面及頁面類別API
    使用的mongoose model: 
      1. 頁面("ROOT/api/model/pages")
      2. 頁面類別("ROOT/api/model/pages_category")
    API方法:
      1. getAllPages            查找所有頁面
      2. getAllCategory         查找所有頁面類別
      3. getPages               查找特定所屬類別的頁面們
      4. getPagesWithoutContent 查找所有頁面(不包含內容)
      5. getPage                查找一個頁面
      6. addCategory            新增頁面類別
      7. editCategory           修改頁面類別
      8. removeCategory         移除頁面類別
      9. addPage                新增頁面
      10. editPage              修改頁面
      11. removePage            移除頁面
*/

var PagesModel = require('./model/pages');
var PagesCategoryModel = require('./model/pages_category');

var PagesProto = {

  // 查找所有頁面
  'getAllPages': function (req, callback) {
    PagesModel
      .find({})
      .populate('category')
      .exec(function (err, pages) {
        callback(pages);
      });
  },

  // 查找所有頁面類別
  'getAllCategory': function (req, callback) {
    PagesCategoryModel
      .find()
      .populate('pages')
      .exec(function (err, pagesCats) {
        callback(pagesCats);
      });
  },

  // 查找特定所屬類別的頁面們
  'getPages': function (req, callback) {
    PagesModel
      .find({category: req.body.category_id})
      .populate('category')
      .exec(function (err, pages) {
        callback(pages);
      });
  },

  // 查找所有頁面(不包含內容)
  'getPagesWithoutContent': function (req, callback) {
    PagesModel
      .find()
      .select('abbr title category')
      .exec(function (err, pages) {
        callback(pages);
      });
  },

  // 查找一個頁面
  'getPage': function (req, callback) {
    PagesModel
      .findOne({abbr: req.body.abbr})
      .populate({
        path: 'category',
        populate: {
          path: 'pages._id'
        }
      })
      .exec(function (err, page) {
        if(page==null) {
          callback({ notfound: true });
        } else {
          callback(page);
        }
      });
  },

  // 新增頁面類別
  'addCategory': function (req, callback) {
    PagesCategoryModel.count({}, function (err, count) {
      var newCat = new PagesCategoryModel();
      newCat.name = req.body.name;
      newCat.order = count;
      newCat.save(function (err, category) {
        callback(category);
      });
    });
  },

  // 修改頁面類別
  'editCategory': function (req, callback) {
    PagesCategoryModel
      .update({_id: req.body.category_id},
          {name: req.body.name}, 
          function (err, category) {
            callback(category);
          });
  },

  // 移除頁面類別
  'removeCategory': function (req, callback) {
    PagesCategoryModel
      .remove({_id: req.body.category_id}, 
          function (err, category) {
            callback(category);
          });
  },

  // 新增頁面
  'addPage': function (req, callback) {
    var newPage = new PagesModel();
    newPage.abbr = req.body.abbr;
    newPage.title = req.body.title;
    newPage.content = req.body.content;
    newPage.category = req.body.category_id;
    newPage.save(function (err, page) {
      if(page) {
        // push the id of the new page into our category model.
        PagesCategoryModel
          .update({_id: req.body.category_id},
              {$push: {pages: [page._id]}},
              function (err, category) {
                callback(category);
              });
      } else {
        callback({msg: 'nope'});
      }
    });
  },

  // 修改頁面
  'editPage': function (req, callback) {
    PagesModel
      .update(
        {_id: req.body.page_id},
        {abbr: req.body.abbr,
         title: req.body.title,
         content: req.body.content,
         category: req.body.category_id},
        function (err, page) {
          PagesCategoryModel.find({pages: [req.body.page_id]}, function (err,pageCat) {
            // check category
            if (pageCat._id != req.body.category_id) {
              // category changed, pull out page id then push in new category
              PagesCategoryModel
                .update(
                  {_id: pageCat._id},
                  {$pull: {pages: [req.body.page_id]}},
                  function (err, pageCat) {
                    PagesCategoryModel
                      .update(
                        {_id: req.body.category_id},
                        {$push: {pages: [req.body.page_id]}},
                        function (err, pageCat) {
                          callback(pageCat);
                        });
                  });
            } else {
              // category didn't change, do nothing
              callback();
            }
          });
        });
  },

  // 移除頁面
  'removePage': function (req, callback) {
    PagesModel
      .remove({_id: req.body.page_id}, function (err, page) {
        PagesCategoryModel
          .update(
            {pages: req.body.page_id},
            {$pull: {pages: [req.body.page_id]}},
            function (err, category) {
              callback(category);
            });
      });
  }

}


function Pages () {
  // init ...
}

Pages.prototype = PagesProto;

module.exports = Pages;