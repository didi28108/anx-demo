var myApp = angular.module('myApp');

myApp.service('NewsService', function($q, $http){

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
		for(id in news) {
			news[id].startdate 	= news[id].startdate.substring(0, 10).replace(/-/g, "/");
			news[id].enddate		= news[id].enddate.substring(0, 10).replace(/-/g, "/");
		}
		return news;
	};

	// 用_id取得消息公告
	var getNews = function (id) {
		return $q(function(resolve, reject) {
			var req = {
				method: 'POST',
				url: 		'/api/getNews',
				data: {
					news_id: id
				}
			}
			$http(req).then(function(result) {
				if(result.data) {
					if(result.data.notfound) {
						resolve(result.data);
					} else {
						var transformed = news_date_transform(result.data);
						resolve(transformed[0]);
					}
				} else {
					reject('nope'); 
				}
			});
		});
	}

	var addNews = function (news) {
		return $q(function(resolve, reject) {
			
			var startdate_str 	= news.startdate.replace(/\//g, "-");
			var startdate_date	= new Date(startdate_str);
			var enddate_str			= news.enddate.replace(/\//g, "-");
			var enddate_date		= new Date(enddate_str);

			var req = {
				method: 'POST',
				url: 		'/api/addNews',
				data: {
					title					: news.title,
					content				: news.content,
					startdate			: startdate_date,
					enddate				: enddate_date,
					category_id 	: news.category,
					// pintotop 	: news.pintotop,
				}
			};
			$http(req).then(function(result)	{
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
			
			var startdate_str 	= news.startdate.replace(/\//g, "-");
			var startdate_date	= new Date(startdate_str);
			var enddate_str			= news.enddate.replace(/\//g, "-");
			var enddate_date		= new Date(enddate_str);

			var req = {
				method: 'POST',
				url: 		'/api/updateNews',
				data: {
					news_id				: news.news_id,
					title					: news.title,
					content				: news.content,
					startdate			: startdate_date,
					enddate				: enddate_date,
					category_id 	: news.category,
					// pintotop 	: news.pintotop,
				}
			};
			$http(req).then(function(result)	{
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
				url: 		'/api/removeNews',
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
				url: 		'/api/newsClicked',
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
		getNewsCategory		: getNewsCategory,
		getAllNews				: getAllNews,
		getNews 					: getNews,
		addNews						: addNews,
		updateNews				: updateNews,
		removeNews				: removeNews,
		clicks						: clicks
	}

});