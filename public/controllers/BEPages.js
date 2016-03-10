angular.module('myApp')

.controller('BEPagesCtrl', function(PagesService, $scope, $state, $stateParams, $window, $location) {
	$scope.url = $location.protocol() + "://" + $location.host();
	$scope.panelVisible = false;
	$scope.addCatFormVisible = false;
	$scope.panelSkinColor;

	$scope.pageCategoryList = [];
	$scope.pageList = [];
	$scope.currentCategory;

	PagesService.getPageCategory().then(function (data) {
		$scope.pageCategoryList = data;
		// if($stateParams.default_category) {
		// 	var currentCatIndex = getCategoryIndexById($stateParams.default_category.id, $scope.pageCategoryList);
		// 	$scope.currentCategory = {
		// 		id: $stateParams.default_category.id,
		// 		name: $scope.pageCategoryList[currentCatIndex].name
		// 	}
		// 	console.log($scope.currentCategory);
		// }
	}, function (err) {
		// err handling ...
	});

	function getCategoryIndexById (id, array) {
		for (var i = array.length - 1; i >= 0; i--) {
			if(array[i]._id == id) {
				return i;
			}
		}
		return null;
	}

	$scope.removeCategory = function () {
		if($window.confirm("是否確認刪除此類別？")) {
			PagesService.removePageCategory(this.cat._id).then(function (data) {
				$state.go('^.pages', null, {reload: true});
			});
		}
	}

	// console.log('default_category:', $stateParams.default_category);

	$scope.showAddCatForm = function () {
		$scope.addCatFormVisible = true;
	}

	$scope.prepareAddPage = function () {
		if($scope.currentCategory) {
			if($scope.panelVisible) {
				if($window.confirm("是否放棄更動當前頁面？")){
					$scope.abbr = '';
					$scope.title = '';
					$scope.content = '';
					$scope.panelTitle = '新增頁面';
					angular.element('#pagePanel').removeClass('panel-warning').addClass('panel-info');
					$scope.addPageMode = true;
					$scope.editPageMode = false;
					$scope.panelVisible = true;
				}
			} else {
				$scope.panelTitle = '新增頁面';
				angular.element('#pagePanel').removeClass('panel-warning').addClass('panel-info');
				$scope.addPageMode = true;
				$scope.editPageMode = false;
				$scope.panelVisible = true;
			}
		}
	}

	$scope.prepareEditPage = function () {
		// trigger this function when a page item is clicked
		if(!$scope.panelVisible) {
			$scope.panelTitle = '編輯頁面';
			PagesService.getPage(this.page.abbr).then(function (data) {
				$scope.title = data.title;
				$scope.abbr = data.abbr;
				$scope.content = data.content;
				angular.element('#pagePanel').removeClass('panel-info').addClass('panel-warning');
				$scope.addPageMode = false;
				$scope.editPageMode = true;
				$scope.panelVisible = true;
				$scope.currentPageId = data._id;
			}, function (err) {
				// err handling ...
			});
		} else {
			if($window.confirm("是否放棄更動當前頁面？")){ 
				$scope.panelTitle = '編輯頁面';
				PagesService.getPage(this.page.abbr).then(function (data) {
					$scope.title = data.title;
					$scope.abbr = data.abbr;
					$scope.content = data.content;
					angular.element('#pagePanel').removeClass('panel-info').addClass('panel-warning');
					$scope.addPageMode = false;
					$scope.editPageMode = true;
					$scope.panelVisible = true;
					$scope.currentPageId = data._id;
				}, function (err) {
					// err handling ...
				});
			}
		}
	}

	$scope.active = function ($event) {
		// $(event.target).addClass('active');
	}

	$scope.addCategory = function () {
		var name = $scope.categoryName;
		PagesService.addPageCategory(name).then(function (data) {
			$state.go('^.pages', {default_category: data._id});
		}, function (err) {
			// err handling ...
		});
	}

	$scope.saveCatName = function (name) {
		var cat_id = this.cat._id;
		var cat_name = name;
		console.log(cat_id, cat_name);
		PagesService.editPageCategory(cat_id, cat_name).then(function (data) {
			$state.go('^.pages', null, {reload: true});
		}, function (err) {
			// err handling ...
		});
	}

	$scope.showPageList = function ($event) {
		if($scope.panelVisible) {
			if($scope.currentCategory.id != this.cat._id) {
				if($window.confirm("是否放棄更動當前頁面？")) {
					$(event.target).siblings().removeClass('active');
					$(event.target).addClass('active');
					$scope.abbr = '';
					$scope.title = '';
					$scope.content = '';
					$scope.panelVisible = false;

					var currentCatIndex = getCategoryIndexById(this.cat._id, $scope.pageCategoryList);
					$scope.currentCategory = {
						id: this.cat._id,
						name: $scope.pageCategoryList[currentCatIndex].name
					}
					PagesService.getPages($scope.currentCategory.id).then(function (data) {
						$scope.pageList = data;
					}, function (err) {
						// err handling ...
					});
				}
			}
		} else {
			$(event.target).siblings().removeClass('active');
			$(event.target).addClass('active');
			var currentCatIndex = getCategoryIndexById(this.cat._id, $scope.pageCategoryList);
			$scope.currentCategory = {
				id: this.cat._id,
				name: $scope.pageCategoryList[currentCatIndex].name
			}
			PagesService.getPages($scope.currentCategory.id).then(function (data) {
				$scope.pageList = data;
			}, function (err) {
				// err handling ...
			});
		}
	}

	$scope.removePage = function () {
		var page = this.page;
		if($window.confirm("是否確認刪除「" + page.title+"」頁面？")) {
			PagesService.removePage(page._id).then(function (data) {
				PagesService.getPages($scope.currentCategory.id).then(function (data) {
					$scope.pageList = data;
				}, function (err) {
					// err handling ...
				});
			});
		}
	}

	$scope.addPage = function () {
		var page = {
			category_id: $scope.currentCategory.id,
			abbr: $scope.abbr,
			title: $scope.title,
			content: $scope.content
		}
		PagesService.addPage(page).then(function (data) {
			if(data.msg) {
				$window.alert("新增失敗，此連結名稱已使用！");
			} else {
				PagesService.getPages($scope.currentCategory.id).then(function (data) {
					$scope.pageList = data;
					$scope.title = '';
					$scope.abbr = '';
					$scope.content = '';
					$scope.panelVisible = false;
					$window.alert("新增成功！");
				}, function (err) {
					// err handling ...
				});
			}
		}, function (err) {
			// err handling ...
		});
	}

	$scope.savePage = function () {
		var page = {
			page_id: $scope.currentPageId,
			category_id: $scope.currentCategory.id,
			abbr: $scope.abbr,
			title: $scope.title,
			content: $scope.content
		}
		PagesService.editPage(page).then(function (data) {
			$state.go('^.pages', null, {reload: true});
		});
	}

	$scope.cancel = function () {
		if($scope.addPageMode) {
			if($window.confirm("是否放棄新增頁面？")){
				$scope.abbr = '';
				$scope.title = '';
				$scope.content = '';
				$scope.panelVisible = false;
			}
		} else {
			if($window.confirm("是否放棄編輯頁面？")){
				$scope.abbr = '';
				$scope.title = '';
				$scope.content = '';
				$scope.panelVisible = false;
			}
		}
	};

});