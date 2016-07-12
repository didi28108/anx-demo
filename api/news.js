/*  消息公告及消息公告類別API
    使用的mongoose model: 
      1. 消息公告("ROOT/api/model/news")
      2. 消息公告類別("ROOT/api/model/news_category")
    消息公告類別API方法:
      1. findAllCategory  查找所有類別
      2. addCategory      新增類別
      3. updateCategory   更新類別
      4. removeCategory   移除類別
      5. countShown       計算類別所包含已顯示的課程數量
    消息公告API方法:
      6. findOne          查找一個消息公告
      7. findAll          查找所有消息公告
      8. findAllShown     查找所有已顯示的消息公告
      9. findTen          查找已顯示, 點閱率最高的10個消息公告
      10. add             新增消息公告
      11. update          更新消息公告
      12. show            更新消息公告顯示
      13. remove          移除消息公告
      14. addClick        息公告點閱量+1
*/

var config = require('../config/db_conn');

var NewsModel = require('./model/news');
var NewsCategoryModel = require('./model/news_category');

var NewsProto = {

  // 消息公告類別之增刪改查

  // 取得所有類別
  'findAllCategory': function(req, callback) {
    NewsCategoryModel
      .find({})
      .sort('order')
      .exec(function (err, categories) {
        callback(categories);
    });
  },

  // 新增類別
  'addCategory': function(req, callback) {
    var newCat = new NewsCategoryModel();
    newCat.name = req.body.name;
    newCat.save(function (err, categories) {
      callback(categories);
    });
  },

  // 更新類別
  'updateCategory': function(req, callback) {
    NewsCategoryModel
      .update(
        { _id: req.body.category_id },
        { name: req.body.name },
        function (err, categories) {
          callback(categories);
        });
  },

  // 移除類別
  'removeCategory': function(req, callback) {
    NewsCategoryModel
      .remove(
        { _id: req.body.category_id },
        function (err, categories) {
          callback(categories);
        });
  },

  // 計算類別所包含已顯示的課程數量
  'countShown': function (callback) {
    NewsCategoryModel
      .find({})
      .sort('order')
      .exec(function (err, categories) {
        NewsModel
          .find({})
          .where({show: true})
          .select('show category')
          .exec(function (err, news) {
            if (categories && news) {
              var categoryClone = JSON.parse(JSON.stringify(categories));
              for (var i = 0; i < news.length ; i++) {
                if(news[i].show) { // 顯示設定為true的在其對應category計數+1
                  for (var k = 0; k < categoryClone.length ; k++) {
                    if(news[i].category == categoryClone[k]._id) {
                      if(categoryClone[k].shownNewsCount) categoryClone[k].shownNewsCount++;
                      else categoryClone[k].shownNewsCount = 1;
                    }
                  }
                }
                if(i == news.length - 1) {
                  for (var k = 0; k < categoryClone.length ; k++) {
                    if(categoryClone[k].shownNewsCount == undefined) categoryClone[k].shownNewsCount = 0;
                    if(k == categoryClone.length - 1) {
                      callback(categoryClone);
                    }
                  }
                }
              }
            } else {
              callback({msg: "categories or news is null!"});
            }
        });
      });
  },


  // 消息公告增刪改查

  // 查找一個消息公告
  'findOne': function(req, callback) {
    NewsModel
      .findOne({ _id: req.body.news_id })
      .populate('category')
      .exec(function (err, news) {
        if(news==null) {
          callback({ notfound: true });
        } else {
          callback(news);
        }
    });
  },

  // 查找所有消息公告
  'findAll': function(req, callback) {
    NewsModel
      .find({})
      .populate('category')
      .sort('-createdate')
      .exec(function (err, news) {
      callback(news);
    });
  },

  // 查找所有已顯示的消息公告
  'findAllShown': function (callback) {
    NewsModel
      .find({})
      .where({show: true})
      .select('title createdate category show clicks')
      .populate('category')
      .sort('-createdate')
      .exec(function (err, news) {
      callback(news);
    });
  },

  // 查找已顯示, 點閱率最高的10個消息公告
  'findTen': function (req, callback) {
    var now = new Date();
    NewsModel
      .find({})
      .where({show: true})
      .select('title createdate category')
      .populate('category')
      .sort('-createdate')
      .limit(10)
      .exec(function (err, news) {
      callback(news);
    });
  },

  // 新增消息公告
  'add': function(req, callback) {

    Date.prototype.addHours = function(h) {    
      this.setTime(this.getTime() + (h*60*60*1000)); 
      return this;   
    };
    var current_date = new Date();
    current_date.addHours(config.timeZoneDiff);

    var newNews = new NewsModel();
    newNews.title     = req.body.news.title;
    newNews.content   = req.body.news.content;
    newNews.category   = req.body.news.category;
    newNews.show    = req.body.news.show;
    newNews.createdate   = current_date;

    newNews.save(function (err, news) {
      NewsCategoryModel
        .update(
          { _id: req.body.news.category },
          {  $push: {news: [ news._id ]}},
          function (err, newsCategory) {
            callback(newsCategory);
        });
    });
  },

  // 更新消息公告
  'update': function(req, callback) {
    NewsModel
      .update(
        { _id: req.body.news._id },
        { title     : req.body.news.title,
          content   : req.body.news.content,
          show    : req.body.show,
          category   : req.body.news.category
        },
        function (err, news) {
          NewsCategoryModel.findOne({news: [req.body.news._id]}, function (err, newsCat) {
            if(newsCat._id != req.body.news.category) {
              NewsCategoryModel
                .update(
                  {_id: newsCat._id},
                  {$pull: {news: [req.body.news._id]}},
                  function (err, newsCat) {
                    NewsCategoryModel
                      .update(
                        {_id: req.body.news.category},
                        {$push: {news: [req.body.news._id]}},
                        function (err, newsCat) {
                          callback(newsCat);
                        });
                  });
            } else {
              callback(newsCat);
            }
          });
      });
  },

  // 更新消息公告顯示
  'show': function (req, callback) {
    NewsModel
      .update(
        {_id: req.body.news._id},
        {show: req.body.news.show},
        function (err, news) {
          callback(news);
        }
      );
  },

  // 移除消息公告
  'remove': function (req, callback) {
    NewsModel.remove({ _id: req.body.news_id }, function (err, news) {
      NewsCategoryModel
        .update(
          { news: [ req.body.news_id ] },
          { $pull: { news: [req.body.news_id] } },
          function (err, newsCategory) {
            callback(newsCategory);
        });
    });
  },

  // 消息公告點閱量+1
  'addClick': function(req, callback) {
    NewsModel
      .update({ _id: req.body.news_id },
              { $inc: { clicks: 1 }},
              function (err, news) {
                callback(news);
      });
  }


}


function News(){
  // initial ...
};

News.prototype = NewsProto;

module.exports = News;