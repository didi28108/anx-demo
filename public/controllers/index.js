module.exports = (ngModule) => {

  // require所有controller

  require('./BECourse')(ngModule);
  require('./BECourseAdd')(ngModule);
  require('./BECourseEdit')(ngModule);
  require('./BECourseView')(ngModule);
  require('./BEMain')(ngModule);
  require('./BENews')(ngModule);
  require('./BENewsView')(ngModule);
  require('./BENewsAdd')(ngModule);
  require('./BENewsEdit')(ngModule);
  require('./BEPages')(ngModule);
  require('./course')(ngModule);
  require('./courseView')(ngModule);
  require('./home')(ngModule);
  require('./login')(ngModule);
  require('./main')(ngModule);
  require('./news')(ngModule);
  require('./newsView')(ngModule);
  require('./page')(ngModule);
  
}