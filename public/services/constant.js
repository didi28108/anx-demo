module.exports = (ngModule) => {

  // 登入驗證相關模組
  ngModule
    .constant('AUTH_EVENTS', {
      notAuthenticated: 'not-authenticated'
    })
    .constant('USER_ROLES', {
      admin: 'admin'
    });
  
}