var CategoryApi = require('./category');
var Category = new CategoryApi();

var CourseModel = require('./model/course');

var CourseProto = {
	// crud starts here
	'create': function(req, callback) {

		Date.prototype.addDays = function(days) {
			this.setDate(this.getDate() + parseInt(days));
			return this;
		};
		Date.prototype.addHours = function(h) {    
			this.setTime(this.getTime() + (h*60*60*1000)); 
			return this;   
		};
		var current_date = new Date();
		current_date.addHours(8);

		var newCourse = new CourseModel();
		newCourse.no 						= req.body.no;
		newCourse.category			= req.body.category;
		newCourse.name  				= req.body.name;
		newCourse.startdate 		=	req.body.startdate;
		newCourse.enddate  			= req.body.enddate;
		newCourse.confirmdate  	= req.body.confirmdate;
		newCourse.duration 			= req.body.duration;
		newCourse.time 					= req.body.time;
		newCourse.area		 			= req.body.area;
		newCourse.location 			= req.body.location;
		newCourse.enroll_target = req.body.enroll_target;
		newCourse.meal_offer 		= req.body.meal_offer;
		newCourse.price 				= req.body.price;
		newCourse.note 					= req.body.note;
		newCourse.contact_info 	= req.body.contact_info;
		newCourse.enroll_link		= req.body.enroll_link;
		newCourse.clicks				= '0';
		newCourse.createdate 		= current_date;

		// save course
		newCourse.save(function (err, data) {
			if (err) {
				throw err;
			}	else {
				// push course id into category's course field
				var course_data = {
					course_id			: data._id,
					category_id		: data.category
				};
				Category.pushCourse(course_data, function (data) {
					callback(data);
				});	
			}
		});
			
	},

	'update': function(req, callback) {
		CourseModel
			.update({ _id: req.body.course_id }, 
							{ no 						: req.body.no,
								category			: req.body.category,
								name  				: req.body.name,
								startdate 		:	req.body.startdate,
								enddate  			: req.body.enddate,
								confirmdate  	: req.body.confirmdate,
								duration 			: req.body.duration,
								time 					: req.body.time,
								area		 			: req.body.area,
								location 			: req.body.location,
								enroll_target : req.body.enroll_target,
								meal_offer 		: req.body.meal_offer,
								price 				: req.body.price,
								note 					: req.body.note,
								enroll_link		: req.body.enroll_link,
								contact_info 	: req.body.contact_info }, 
							function (err, course) {
								if(err) console.log(err);
								// if(err) throw err;
								// else callback(course);
								callback(course);
							});
	},

	'getAll': function(req, callback) {
		CourseModel
			.find()
			.populate('category')
			.select('no category area name startdate enddate confirmdate clicks')
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

	'removeOne': function(req, callback) {
		CourseModel.remove({ _id: req.body.course_id }, function (err, data) {
			if (err) throw err;
			else {
				var course_data = {
					category_id		: req.body.category_id,
					course_id			: req.body.course_id
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
	}

}



function Course(){
	// initial ...
};
Course.prototype = CourseProto;
module.exports = Course;
