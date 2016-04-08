angular.module('myApp')

.controller('BECourseCtrl', function(CourseService, $scope, $http, $state, $stateParams, $window){
	
	$scope.showCourseManage = true;
	$scope.showCategoryManage = false;

	// console.log($stateParams);

	if($stateParams.mode=="categoryManage") {
		manageModeToggle();
	}

	$scope.panelTitle = "新增單位";
	angular.element('#categoryPanel').addClass('panel-info');
	$scope.showAddCategoryBtn = true;
	$scope.classes = ["雲科大", "政府單位"];
	$scope.courseStateList = ["開課", "未處理", "不開課"];

	$scope.categoryFormData = {
		class: "雲科大",
		deptName: "",
		deptCode: "",
		show: true
	};

	$scope.currentCategory = '';

	$scope.sortType = '';
	$scope.sortReverse = false;
	$scope.searchFish = '';

	CourseService.getCourseCategoryList().then(function(data) {
		$scope.categoryList = data;
		if($stateParams.default_category == null) {
			var categoryIndex = getIndexByCourseCategoryDeptCode($scope.categoryList, 'ANX');
			if(categoryIndex != null) {
				$scope.currentCategory = $scope.categoryList[categoryIndex];
			} else {
				$scope.currentCategory = $scope.categoryList[0];
			}
		} else {
			$scope.currentCategory = $stateParams.default_category;
		}
	}, function(err) {
		// err handling
	});

	CourseService.getAllCourse().then(function(data) {
		$scope.courses = data;
	}, function(err) {
		// err handling
	});

	$scope.switchManageMode = function () {
		manageModeToggle();
	};

	function manageModeToggle() {
		$scope.showCourseManage = !$scope.showCourseManage;
		$scope.showCategoryManage = !$scope.showCategoryManage;
	};

	$scope.switchFormPanelMode = function () {
		formPanelModeToggle();
	}

	function formPanelModeToggle() {
		if($scope.panelTitle=="新增單位"){
			$scope.panelTitle = "修改單位資料";
			angular.element('#categoryPanel').remove('panel-info').addClass('panel-warning');
			$scope.showAddCategoryBtn = false;
			$scope.showEditCategoryBtn = true;
		} else {
			$scope.panelTitle = "新增單位";
			angular.element('#categoryPanel').remove('panel-warning').addClass('panel-info');
			$scope.showAddCategoryBtn = true;
			$scope.showEditCategoryBtn = false;
		}
	}

	//show course on list when a category is clicked
	$scope.showCourse = function () {
		$scope.sortType = '';
		for(id in $scope.categoryList) {
			if($scope.categoryList[id].deptName == this.cat.deptName) {
				$scope.currentCategory = $scope.categoryList[id];
			}
		}
	};

	$scope.goAdd = function() {
		$state.go('^.addCourse');
	};

	/* course list options */
	// edit course
	$scope.goEdit = function() {
		$state.go('^.editCourse', { course_id: this.course._id });
	};

	$scope.delete = function() {
		var course_id = this.course._id;
		var category_id = this.course.category._id;
		if($window.confirm("被刪除的課程無法被復原\n是否確定要刪除此課程？")){
			var data = {
				course_id	: course_id,
				category_id	: category_id
			}
			CourseService.removeCourse(data).then(function(result){
				console.log('remove succeeded!');
				$state.go('backend.course', null, { reload: true });
			}, function(err) {
				// err handling ...
			});
		}
	};

	function getIndexByCourseCategoryDeptCode (array, deptCode) {
		for (var i = 0; i < array.length; i++) {
			if (array[i].deptCode == deptCode) {
				return i;
			}
		}
		return null;
	}

	$scope.stateChanged = function () {
		var course = {
			_id: this.$parent.course._id,
			state: this.$parent.course.state
		}
		var fullNo = this.$parent.course.fullNo;
		var name = this.$parent.course.name;

		CourseService.updateCourseState(course).then(function (result) {
			if (result.nModified) {
				$window.alert("更新成功！\n\n課號: 「 " + fullNo + " 」  課程名稱: 「" + name + " 」\n之課程狀態已更新為「 " + course.state + " 」");
			} else {
				$window.alert("發生錯誤，請再試一次！");
			}
		});
	}

	$scope.pinTop = function () {
		var course = {
			_id: this.$parent.course._id,
			pinTop: !this.$parent.course.pinTop
		}
		var fullNo = this.$parent.course.fullNo;
		var name = this.$parent.course.name;

		CourseService.pinTop(course).then(function (result) {
			console.log(result);
			if (result.nModified) {
				var msg = course.pinTop ? "已改為推薦課程" : "已取消推薦";
				
				for (var i = $scope.courses.length - 1; i >= 0; i--) {
					if ($scope.courses[i]._id == course._id) {
						$scope.courses[i].pinTop = !$scope.courses[i].pinTop;
					}
				}

				$window.alert("更新成功！\n\n課號: 「 " + fullNo + " 」  課程名稱: 「" + name + " 」\n" + msg);
			} else {
				$window.alert("發生錯誤，請再試一次！");
			}
		});
	}



	$scope.addCategory = function () {
		var data = {
			class: $scope.categoryFormData.class,
			deptName: $scope.categoryFormData.deptName,
			deptCode: $scope.categoryFormData.deptCode,
			show: Boolean($scope.categoryFormData.show)
		}
		CourseService.addCategory(data).then(function(result) {
			$state.go('^.course', {mode: 'categoryManage'}, {reload: true});
		});
	}

	$scope.showCategoryData = function () {
		if($scope.panelTitle == "新增單位") {
			formPanelModeToggle();
		}
		$scope.categoryFormData.id = this.cat._id;
		$scope.categoryFormData.class = this.cat.class;
		$scope.categoryFormData.deptName = this.cat.deptName;
		$scope.categoryFormData.deptCode = this.cat.deptCode;
		$scope.categoryFormData.show = this.cat.show.toString();
	}

	$scope.saveCategory = function () {
		console.log($scope.categoryFormData);
		console.log(typeof $scope.categoryFormData.show);
		var data = {
			id: $scope.categoryFormData.id,
			class: $scope.categoryFormData.class,
			deptName: $scope.categoryFormData.deptName,
			deptCode: $scope.categoryFormData.deptCode,
			show: $scope.categoryFormData.show
		}
		CourseService.editCategory(data).then(function(result) {
			$state.go('^.course', {mode: 'categoryManage'}, {reload: true});
		});
	}

	$scope.cancel = function () {
		$state.go('^.course', {mode: 'categoryManage'}, {reload: true});
	}
	
});