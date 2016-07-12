var mongoose = require('mongoose');

// 後台管理者帳密
var UserSchema = new mongoose.Schema({
  name: {               // 後台管理者者帳號
    type    : String,
    unique  : true,
    required: true
  },
  password: {           // 後台管理者密碼
    type: String,
    required: true
  }
});

// not using bcrypt package due to npm install failure ...

module.exports = mongoose.model('User', UserSchema);