var myApp = angular.module('myApp');

myApp.controller('BECourseAddCtrl', function($scope, $http, $state, $window){
	// 將目前的$state注入$scope中，供views使用
	$scope.$state = $state;

	// 設定表單預設值	

	$scope.meal = 'no';		// 預設不供餐
	$scope.area = '6';		// 預設雲林地區

	// 取得開課單位
	$http.get('/api/getCategory').then(function(result) {
		$scope.categoryList = result.data;

		// 將第一筆category資料設定為預設選項
		if($scope.categoryList != null) {
			$scope.category = $scope.categoryList[0]._id;
		}
	}, function(err) {
		// err handling
	});

	$scope.add = function () {

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
		var req = {
			method: 'POST',
			url: '/api/addCourse',
			data: {
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
				contact_info	: $scope.contact
			}
		};

		$http(req).then(function(result) {
			$state.go('^.course');
		}, function(err) {
			// err handling
		});
	};

	$scope.test = function () {
		console.log($scope.areaList.options[$scope.area].id, $scope.areaList.options[$scope.area].name);
	};

	$scope.cancel = function () {
		if($window.confirm("是否放棄新增課程？")){
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