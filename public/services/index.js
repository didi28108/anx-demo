module.exports = (ngModule) => {

  require('./auth')(ngModule);
  require('./constant')(ngModule);
  require('./course')(ngModule);
  require('./guest')(ngModule);
  require('./news')(ngModule);
  require('./pages')(ngModule);

}