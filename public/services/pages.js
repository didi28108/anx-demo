module.exports = (ngModule) => {

  // 其他頁面相關http request service
  ngModule.service('PagesService', function($q, $http) {

    var getPageCategory = function () {
      return $q(function(resolve, reject) {
        $http.get('/api/getPageCategory').then(function(result) {
          if(result.data) {
            resolve(result.data);
          } else {
            reject('nope');
          }
        });
      });
    };

    var addPageCategory = function (categoryName) {
      return $q(function(resolve, reject) {
        var req = {
          method: 'POST',
          url: '/api/addPageCategory',
          data: {
            name: categoryName
          }
        }
        $http(req).then(function(result) {
          if(result.data) {
            resolve(result.data);
          } else {
            reject('nope');
          }
        });
      });
    };

    var editPageCategory = function (id, name) {
      return $q(function(resolve, reject) {
        var req = {
          method: 'POST',
          url: '/api/editPageCategory',
          data: {
            category_id: id,
            name: name
          }
        }
        $http(req).then(function(result) {
          if(result.data) {
            resolve(result.data);
          } else {
            reject('nope');
          }
        });
      })
    };

    var removePageCategory = function (categoryId) {
      return $q(function(resolve, reject) {
        var req = {
          method: 'POST',
          url: '/api/removePageCategory',
          data: {
            category_id: categoryId
          }
        }
        $http(req).then(function(result) {
          if(result.data) {
            resolve(result.data);
          } else {
            reject('nope');
          }
        });
      })
    };

    var getPages = function (id) {
      return $q(function(resolve, reject) {
        var req = {
          method: 'POST',
          url: '/api/getPages',
          data: {
            category_id: id
          }
        }
        $http(req).then(function(result) {
          if(result.data) {
            resolve(result.data);
          } else {
            reject('nope');
          }
        });
      })
    };

    var getPagesWithoutContent = function () {
      return $q(function(resolve, reject) {
        $http.get('/api/getPagesWithoutContent').then(function(result) {
          if(result.data) {
            resolve(result.data);
          } else {
            reject('nope');
          }
        });
      })
    };

    var getPage = function (pageAbbr) {
      return $q(function(resolve, reject) {
        var req = {
          method: 'POST',
          url: '/api/getPage',
          data: {
            abbr: pageAbbr
          }
        }
        $http(req).then(function(result) {
          if(result.data) {
            resolve(result.data);
          } else {
            reject({notfound: true});
          }
        });
      })
    };

    var addPage = function (page) {
      console.log('title', page.title);
      return $q(function(resolve, reject) {
        var req = {
          method: 'POST',
          url: '/api/addPage',
          data: {
            abbr: page.abbr,
            title: page.title,
            content: page.content,
            category_id:  page.category_id
          }
        }
        $http(req).then(function(result) {
          if(result.data) {
            resolve(result.data);
          } else {
            reject('nope');
          }
        });
      })
    };

    var editPage = function (page) {
      return $q(function(resolve, reject) {
        var req = {
          method: 'POST',
          url: '/api/editPage',
          data: {
            page_id: page.page_id,
            abbr: page.abbr,
            title: page.title,
            content: page.content,
            category_id:  page.category_id
          }
        }
        $http(req).then(function(result) {
          if(result.data) {
            resolve(result.data);
          } else {
            reject('nope');
          }
        });
      })
    };

    var removePage = function (pageId) {
      return $q(function(resolve, reject) {
        var req = {
          method: 'POST',
          url: '/api/removePage',
          data: {
            page_id: pageId
          }
        }
        $http(req).then(function(result) {
          if(result.data) {
            resolve(result.data);
          } else {
            reject('nope');
          }
        });
      })
    };

    return {
      getPageCategory    : getPageCategory,
      addPageCategory    : addPageCategory,
      editPageCategory   : editPageCategory,
      removePageCategory : removePageCategory,
      getPages   : getPages,
      getPage    : getPage,
      addPage    : addPage,
      editPage   : editPage,
      removePage : removePage,
      getPagesWithoutContent : getPagesWithoutContent
    }

  });

}