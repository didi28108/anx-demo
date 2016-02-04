angular.module('myApp')

.controller('BECourseEditCtrl', function($scope, $http, $state, $stateParams, $window){
	$scope.$state = $state;

	// 如果無法從$stateParams取得課程_id的話就導向課程清單
	if($stateParams.course_id == null) {
		$state.go('^.course');
	}

	// 取得開課單位
	$http.get('/api/getCourseCategory').then(function(result) {
		$scope.categoryList = result.data;

	}, function(err) {
		// err handling
	});

	// 用課程_id取得課程
	var getCourseReq = {
		method: 'POST',
		url: '/api/getCourse',
		data: {
			course_id: $stateParams.course_id
		}
	};
	$http(getCourseReq).then(function(result) {
		var course = result.data;

		// 是否供餐由boolean轉換為text(yes/no)
		var meal;
		if(course.meal_offer) {
			meal = 'yes';
		} else {
			meal = 'no';
		}

		// 日期由Date轉換為符合datepicker input的string格式
		var startdate 	= course.startdate.toString().substring(0,10).replace(/-/g, "/");
		var enddate			= course.enddate.toString().substring(0,10).replace(/-/g, "/");
		var confirmdate	= course.confirmdate.toString().substring(0,10).replace(/-/g, "/");

		// 資料塞進$scope
		$scope.category				= course.category._id;
		$scope.no 						= course.no;
		$scope.name						= course.name;
		$scope.startdate			= startdate;
		$scope.enddate				= enddate;
		$scope.confirmdate		= confirmdate;
		$scope.duration				= course.duration;
		$scope.time						= course.time;
		$scope.area						= course.area.id.toString();	// 地區id要特別轉換為string
		$scope.location				= course.location;
		$scope.target					= course.enroll_target;
		$scope.meal						= meal;
		$scope.price					= course.price;
		$scope.note						= course.note;
		$scope.contact				= course.contact_info;
		$scope.link						= course.enroll_link;

	});


	// 儲存對課程的編輯
	$scope.save = function () {

		// 將表單上
		// startdate, enddate, confirmdate
		// 的value格式由string轉為date
		var startdate_str = $scope.startdate.replace(/\//g, "-");
		var startdate_date = new Date(startdate_str);
		var enddate_str = $scope.enddate.replace(/\//g, "-");
		var enddate_date = new Date(enddate_str);
		var confirmdate_str = $scope.confirmdate.replace(/\//g, "-");
		var confirmdate_date = new Date(confirmdate_str);

		// 將表單上meal的value轉換成boolean
		var meal_offer;
		if($scope.meal == 'yes') {
			meal_offer = true;
		} else {
			meal_offer = false;
		}

		// $http request content
		var updateCourseReq = {
			method: 'POST',
			url: '/api/updateCourse',
			data: {
				course_id			: $stateParams.course_id,
				category			: $scope.category,
				no 						: $scope.no,
				name					: $scope.name,
				startdate			: startdate_date,
				enddate				: enddate_date,
				confirmdate		: confirmdate_date,
				duration			: $scope.duration,
				time					: $scope.time,
				area					: { id: $scope.areaList.options[$scope.area].id,
													name: $scope.areaList.options[$scope.area].name },
				location			: $scope.location,
				enroll_target	: $scope.target,
				meal_offer		: meal_offer,
				price					: $scope.price,
				note					: $scope.note,
				contact_info	: $scope.contact,
				enroll_link		: $scope.link
			}
		};

		$http(updateCourseReq).then(function(result) {
			$state.go('^.course');
		}, function(err) {
			// err handling
			console.log('ERROR!!!');
			console.log(err);
		});
	};

	// 捨棄編輯
	$scope.cancel = function () {
		if($window.confirm("若取消編輯此課程，您的更動將不會被儲存。\n是否捨棄編輯課程？")){
			$state.go('^.course');
		}
	};


	// 課程地區清單
	$scope.areaList = {
		options: [
			{id: '0', name: '基隆'},
			{id: '1', name: '台北'},
			{id: '2', name: '新竹'},
			{id: '3', name: '苗栗'},
			{id: '4', name: '台中'},
			{id: '5', name: '彰化'},
			{id: '6', name: '雲林'},
			{id: '7', name: '嘉義'},
			{id: '8', name: '台南'},
			{id: '9', name: '高雄'},
			{id: '10', name: '屏東'},
			{id: '11', name: '宜蘭'},
			{id: '12', name: '花蓮'},
			{id: '13', name: '台東'},
			{id: '14', name: '澎湖'},
			{id: '15', name: '馬祖'},
			{id: '16', name: '金門'}
		]
	};

});