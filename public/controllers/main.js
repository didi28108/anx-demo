module.exports = (ngModule) => {

  ngModule.controller('MainCtrl', function(PagesService, $scope, $state) {
    
    /*  app main controller
     *  template: index.html
     */

    // 判斷是否在後台
    $scope.isInBackend = function () {
      return $state.includes("backend");
    }
    
    // 取得footer資料
    getFooterData(chunk);    // 目前footer資料在寫死前端

    function getFooterData (callback) {
      var categories = [];
      var pages = [];
      var results = [];
      // 取得頁面類別
      PagesService.getPageCategory().then(function (data) {
        categories = data;

        // 取得頁面資料(不包含頁面內容)
        PagesService.getPagesWithoutContent().then(function (data) {
          pages = data;

          for(var cat in categories) {
            var part = {
              _id: categories[cat]._id,
              name: categories[cat].name,
              pages: []
            };
            for(var page in pages) {
              if(categories[cat]._id == pages[page].category) {
                var screw = {
                  _id: pages[page]._id,
                  category: pages[page].category,
                  title: pages[page].title,
                  abbr: pages[page].abbr
                };
                part.pages.push(screw);
              }
            }
            results.push(part);
          }
          // 將頁面資料陣列改為五個一行
          $scope.chunkedData = callback(results, 5);
          console.log($scope.chunkedData);
        }, function (err) {
          // err handling ...
        });
      }, function (err) {
        // err handling ...
      });
    }

    function chunk(arr, size) {
      var newArr = [];
      for (var i=0; i<arr.length; i+=size) {
        newArr.push(arr.slice(i, i+size));
      }
      return newArr;
    }

  });

}