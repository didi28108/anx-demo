module.exports = function (ngModule) {
	ngModule.directive('helloWorld', helloWorldFn);
	function helloWorldFn() {
		return {
			restrict: 'E',
			scope: {},
			template: require('./hello-world.html'),
			controller: ['$scope', function($scope) {
				$scope.msg = 'Hello World!';
			}]
		}
	}
}