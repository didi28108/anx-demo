var CourseModel = require('./model/course');

var CourseProto = {
	// crud starts here
	'create': function(req, callback) {
		// fuck off if anything is undefined
		// if (typeof(req.body.no)==='undefined' ||
		// 		typeof(req.body.unit)==='undefined' ||
		// 		typeof(req.body.name)==='undefined' ||
		// 		typeof(req.body.startdate)==='undefined' ||
		// 		typeof(req.body.enddate)==='undefined' ||
		// 		typeof(req.body.confirmdate)==='undefined' ||
		// 		typeof(req.body.duration)==='undefined' ||
		// 		typeof(req.body.time)==='undefined' ||
		// 		typeof(req.body.area)==='undefined' ||
		// 		typeof(req.body.location)==='undefined' ||
		// 		typeof(req.body.enroll_target)==='undefined' ||
		// 		typeof(req.body.price)==='undefined' ||
		// 		typeof(req.body.note)==='undefined' ||
		// 		typeof(req.body.contact_info)==='undefined') {
		// 	callback({msg: 'nope'});

		// } else {
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

			console.log(req.body);

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
			newCourse.createdate 		= current_date;

			newCourse.save(function (err, data) {
				if (err) throw err;
				else callback(data);
			});
			
		// }
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
								contact_info 	: req.body.contact_info }, 
							function (err, course) {
								if(err) throw err;
								else callback(course);
							});
	},

	'getAll': function(req, callback) {
		CourseModel
			.find()
			.populate('category')
			.select('no category area name startdate enddate confirmdate')
			.exec(function (err, data) {
				callback(data);
			});
	},

	'getOne': function(req, callback) {
		CourseModel
			.findOne({_id: req.body.course_id})
			.populate('category')
			.exec(function (err, data) {
				callback(data);
			});
	},

	'removeOne': function(req, callback) {
		CourseModel.remove({ _id: req.body.course_id}, function (err, data) {
			res.json(data);
		});
	},

	'removeAll': function(req, callback) {
		CourseModel.remove({}, function (err, data) {
			callback(data);
		});
	}

}



function Course(){
	// initial ...
};
Course.prototype = CourseProto;
module.exports = Course;
