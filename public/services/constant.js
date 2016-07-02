module.exports = (ngModule) => {

  ngModule
    .constant('AUTH_EVENTS', {
      notAuthenticated: 'not-authenticated'
    })
    .constant('USER_ROLES', {
      admin: 'admin'
    });
  
}