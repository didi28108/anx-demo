var config = require('../config/db_conn');

var CategoryApi = require('./category');
var Category = new CategoryApi();

var CourseModel = require('./model/course');

Date.prototype.addHours = function(h) {    
	this.setTime(this.getTime() + (h*60*60*1000)); 
	return this;   
};

var CourseProto = {
	'create': function(req, callback) {

		// Date.prototype.addDays = function(days) {
		// 	this.setDate(this.getDate() + parseInt(days));
		// 	return this;
		// };

		var SD = new Date(req.body.course.startDate);
		SD.addHours(config.timeZoneDiff);

		var ED = new Date(req.body.course.endDate);
		ED.addHours(config.timeZoneDiff);

		var CD = new Date(req.body.course.confirmDate);
		CD.addHours(config.timeZoneDiff);

		var EnrollDueD = new Date(req.body.course.enrollDueDate);
		EnrollDueD.addHours(config.timeZoneDiff);

		var ST = new Date(req.body.course.startTime);
		ST = ST.toString().substring(16,21);

		var ET = new Date(req.body.course.endTime);
		ET = ET.toString().substring(16,21);

		var newCourse = new CourseModel();
		newCourse.category		= req.body.course.category;
		newCourse.year 			= req.body.course.year;
		newCourse.no 			= req.body.course.no;
		newCourse.fullNo 		= req.body.course.fullNo;
		newCourse.name  		= req.body.course.name;
		newCourse.startDate 	= SD;
		newCourse.endDate  		= ED;
		newCourse.startTime 	= ST;
		newCourse.endTime	 	= ET;
		newCourse.location 		= req.body.course.location;
		newCourse.confirmDate  	= CD;
		newCourse.enrollDueDate = EnrollDueD;
		newCourse.enrollTarget	= req.body.course.enrollTarget;
		newCourse.launchOffer 	= req.body.course.launchOffer;
		newCourse.price 		= req.body.course.price;
		newCourse.state 		= req.body.course.state;
		newCourse.maxEnroll		= req.body.course.maxEnroll;
		newCourse.remark 		= req.body.course.remark;
		newCourse.helpline 		= req.body.course.helpline;
		newCourse.area		 	= req.body.course.area;
		newCourse.enrollLink	= req.body.course.enrollLink;
		newCourse.clicks		= '0';
		newCourse.createDate 	= getCurrentDate();

		// save course
		newCourse.save(function (err, data) {
			if (err) {

				callback(
					{
						success: false,
						err: {
							name: err.name,
							msg: err.message,
							code: err.code
						}
					}
				);

			}	else {

				// push course id into category's course field
				var course_data = {
					course_id		: data._id,
					category_id		: data.category
				};
				Category.pushCourse(course_data, function (data) {
					callback({success: true});
				});

			}
		});
			
	},

	'update': function(req, callback) {

		var SD = new Date(req.body.course.startDate);
		SD.addHours(config.timeZoneDiff);

		var ED = new Date(req.body.course.endDate);
		ED.addHours(config.timeZoneDiff);

		var CD = new Date(req.body.course.confirmDate);
		CD.addHours(config.timeZoneDiff);

		var ST = new Date(req.body.course.startTime);
		ST = ST.toString().substring(16,21);

		var ET = new Date(req.body.course.endTime);
		ET = ET.toString().substring(16,21);

		CourseModel
			.update({ _id: req.body.course._id }, 
					{ 
						category		: req.body.course.category,
						year			: req.body.course.year,
						no 				: req.body.course.no,
						fullNo 			: req.body.course.fullNo,
						name			: req.body.course.name,
						startDate		: SD,
						endDate 		: ED,
						startTime		: ST,
						endTime			: ET,
						location		: req.body.course.location,
						confirmDate 	: CD,
						enrollDueDate	: req.body.course.enrollDueDate,
						enrollTarget	: req.body.course.enrollTarget,
						launchOffer		: req.body.course.launchOffer,
						price 			: req.body.course.price,
						state 			: req.body.course.state,
						maxEnroll		: req.body.course.maxEnroll,
						remark			: req.body.course.remark,
						helpline		: req.body.course.helpline,
						area			: req.body.course.area,
						enrollLink		: req.body.course.enrollLink
					}, 
					function (err, course) {
						if (err) {

							callback(
								{
									success: false,
									err: {
										name: err.name,
										msg: err.message,
										code: err.code
									}
								}
							);

						}	else {

							// get previous category of the course
							Category.getPrevious({course_id: req.body.course._id}, function (previousCategory) {
								// check whether the course category has changed
								if (req.body.course.category != previousCategory._id) {
									// pull course id from previous category.course[]
									var course_data = {
										course_id			: req.body.course._id
									};
									Category.pullCourse(course_data, function (data) {
										// push course id into new category.course[]
										var course_data = {
											course_id		: req.body.course._id,
											category_id		: req.body.course.category
										};
										Category.pushCourse(course_data, function (data) {
											callback({success: true});
										});
									});
								} else {
									callback({success: true});
								}
							});

						}
				});
	},

	'updateState': function (req, callback) {
		CourseModel
			.update(
				{ _id: req.body.course._id },
				{ state: req.body.course.state },
				function (err, data) {
					callback(data);
			});
	},

	'getAll': function(req, callback) {
		CourseModel
			.find()
			.populate('category')
			.select('fullNo category area name startDate endDate confirmDate state clicks pinTop')
			.sort('-createdate')
			.exec(function (err, data) {
				callback(data);
			});
	},

	'getOne': function(req, callback) {
		CourseModel
			.findOne({_id: req.body.course_id})
			.populate('category')
			.exec(function (err, data) {
				if(data==null) {
					callback({notfound: true});
				} else {
					callback(data);
				}
			});
	},

	'getPopular': function (req, callback) {
		var tmr = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
		var day = tmr.getDate();
		var month = tmr.getMonth() + 1;
		var year = tmr.getFullYear;
		var tmrDate = new Date(year+"-"+month+"-"+day);
		CourseModel
			.find({})
			.populate('category')
			.where('enrollDueDate').gt(tmrDate)
			.select('category area name startDate endDate confirmDate state clicks pinTop')
			.sort('-clicks')
			.limit(10)
			.exec(function (err, data) {
				callback(data);
			});
	},

	'getPinTop': function (req, callback) {
		var tmr = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
		var day = tmr.getDate();
		var month = tmr.getMonth() + 1;
		var year = tmr.getFullYear;
		var tmrDate = new Date(year+"-"+month+"-"+day);
		CourseModel
			.find({pinTop: true})
			.populate('category')
			.where('enrollDueDate').gt(tmrDate)
			.select('category area name startDate endDate confirmDate state clicks pinTop')
			.sort('-clicks')
			.limit(10)
			.exec(function (err, data) {
				callback(data);
			});
	},

	'removeOne': function(req, callback) {
		CourseModel.remove({ _id: req.body.course_id }, function (err, data) {
			if (err) throw err;
			else {
				var course_data = {
					category_id		: req.body.category_id,
					course_id		: req.body.course_id
				};
				Category.pullCourse(course_data, function (data) {
					callback(data);
				});
			}
		});
	},

	'removeAll': function(req, callback) {
		CourseModel.remove({}, function (err, data) {
			callback(data);
		});
	},

	'addClick': function(req, callback) {
		CourseModel
			.update({ _id: req.body.course_id },
					{ $inc: { clicks: 1 }},
					function (err, course) {
						callback(course);
			});
	},

	'pinTop': function (req, callback) {
		CourseModel
			.update(
				{_id: req.body.course._id},
				{pinTop: req.body.course.pinTop},
				function (err, course) {
					callback(course);
				}
			);
	}

}

var getCurrentDate = function () {
	Date.prototype.addHours = function(h) {    
		this.setTime(this.getTime() + (h*60*60*1000)); 
		return this;   
	};
	var current_date = new Date();
	current_date.addHours(config.timeZoneDiff);
	return current_date;
}

function Course(){
	// initial ...
};
Course.prototype = CourseProto;
module.exports = Course;
