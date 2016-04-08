angular.module('myApp')

.controller('MainCtrl', function(PagesService, $scope, $state) {

	$scope.isInBackend = function () {
		return $state.includes("backend");
	}

	getFooterData(chunk);

	function getFooterData (callback) {
		var categories = [];
		var pages = [];
		var results = [];
		PagesService.getPageCategory().then(function (data) {
			categories = data;

			PagesService.getPagesWithoutContent().then(function (data) {
				pages = data;

				for(cat in categories) {
					var part = {
						_id: categories[cat]._id,
						name: categories[cat].name,
						pages: []
					};
					for(page in pages) {
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
				$scope.chunkedData = callback(results, 5);
				// console.log($scope.chunkedData);
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

	// $scope.chunkedData = chunk($scope.footerData, 4);


});