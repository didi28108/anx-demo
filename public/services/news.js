module.exports = (ngModule) => {

  // 消息公告相關http request service
  ngModule.service('NewsService', function($q, $http){

    // 取得消息公告分類
    var getNewsCategory = function () {
      return $q(function(resolve, reject) {
        $http.get('/api/getNewsCategory').then(function(result) {
          if(result.data) {
            resolve(result.data);
          } else {
            reject('nope');
          }
        });
      });
    }

    // 取得所有消息公告
    var getAllNews = function () {
      return $q(function(resolve, reject) {
        $http.get('/api/getAllNews').then(function(result) {
          if(result.data) {
            resolve(news_date_transform(result.data));
          } else {
            reject('nope');
          }
        });
      });
    }
    // 取得消息公告後將日期格式轉為yyyy-mm-dd
    function news_date_transform (news) {
      for(var id in news) {
        news[id].createdate   = news[id].createdate.substring(0, 10).replace(/-/g, "/");
      }
      return news;
    };

    // 用_id取得消息公告
    var getNews = function (id) {
      return $q(function(resolve, reject) {
        var req = {
          method: 'POST',
          url:   '/api/getNews',
          data: {
            news_id: id
          }
        }
        $http(req).then(function(result) {
          if(result.data) {
            if(result.data.notfound) {
              resolve(result.data);
            } else {
              result.data.createdate = result.data.createdate.substring(0, 10).replace(/-/g, "/");
              resolve(result.data);
            }
          } else {
            reject('nope'); 
          }
        });
      });
    }

    var addNews = function (news) {
      return $q(function(resolve, reject) {
        var req = {
          method: 'POST',
          url:     '/api/addNews',
          data: {
            news: news
          }
        };
        $http(req).then(function(result)  {
          if(result.data) {
            resolve(result.data);
          } else {
            reject('nope');
          }
        });
      });
    }

    var updateNews = function (news) {
      return $q(function(resolve, reject) {
        var req = {
          method: 'POST',
          url:     '/api/updateNews',
          data: {
            news: news
          }
        };
        $http(req).then(function(result)  {
          if(result.data) {
            resolve(result.data);
          } else {
            reject('nope');
          }
        });
      });
    }

    var setShow = function (news) {
      return $q(function(resolve, reject) {
        var req = {
          method: 'POST',
          url:     '/api/newsSetShow',
          data: {
            news: news
          }
        };
        $http(req).then(function(result)  {
          if(result.data) {
            resolve(result.data);
          } else {
            reject('nope');
          }
        });
      });
    }

    // 用_id刪除消息公告
    var removeNews = function (id) {
      return $q(function(resolve, reject) {
        var req = {
          method: 'POST',
          url:     '/api/removeNews',
          data : {
            news_id: id
          }
        };
        $http(req).then(function(result){
          if(result.data) {
            resolve(result.data);
          } else {
            reject('nope');
          }
        });
      });
    }

    var clicks = function (id) {
      return $q(function(resolve, reject) {
        var req = {
          method: 'POST',
          url:     '/api/newsClicked',
          data : {
            news_id: id
          }
        };
        $http(req).then(function(result){
          if(result.data) {
            resolve(result.data);
          } else {
            reject('nope');
          }
        });
      });
    }


    return {
      getNewsCategory    : getNewsCategory,
      getAllNews      : getAllNews,
      getNews       : getNews,
      addNews        : addNews,
      updateNews      : updateNews,
      setShow       : setShow,
      removeNews      : removeNews,
      clicks        : clicks
    }

  });

}