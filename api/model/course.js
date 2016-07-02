/* 課程schema */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CourseSchema = new Schema({
  category      : {                // 課程所屬類別的_id, 參照Category collections
                    type: Schema.Types.ObjectId,
                    ref: 'Category'
                  },
  subcategory   : [String],        // 課程子類別, 課程對子類別唯一對多
  year          : Number,          // 年
  no            : String,          // 課程編號
  fullNo        : {                // 完整課號("年-課程編號"), 必須為唯一值
                    type: String,
                    unique: true
                  },
  name          : String,          // 課程名稱
  info          : String,          // 課程資訊
  goal          : String,          // 課程目標
  lecturerInfo  : String,          // 講師資訊
  startDate     : Date,            // 開始日期
  endDate       : Date,            // 結束日期
  startTime     : String,          // 開始時間
  endTime       : String,          // 結束時間
  location      : String,          // 上課地點
  confirmDate   : Date,            // 開課確認日期
  enrollDueDate : Date,            // 報名截止日期
  enrollTarget  : String,          // 招生對象
  launchOffer   : String,          // 提供午餐
  price         : Number,          // 費用
  state         : String,          // 課程狀態("未處理", "開課", "不開課")
  maxEnroll     : Number,          // 報名人數上限
  remark        : String,          // 備註
  helpline      : String,          // 諮詢專線
  area          : String,          // 地區
  enrollLink    : String,          // 報名連結
  clicks        : {                // 點閱次數
                    type: Number,
                    default: 0
                  },
  pinTop        : Boolean,         // 推薦釘選
  show          : Boolean,         // 顯示或隱藏
  createDate    : Date,            // 建立日期
  updateDate    : Date             // 更新日期
});

module.exports = mongoose.model('Course', CourseSchema);
