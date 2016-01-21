var myApp = angular.module('myApp');

myApp
  .constant('AUTH_EVENTS', {
    notAuthenticated: 'not-authenticated'
  })

  .constant('USER_ROLES', {
    admin: 'admin'
  });