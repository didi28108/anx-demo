
module.exports = function (app, root_dir) {


	app.use('*', function (req, res) {
		res.sendFile(root_dir + '/public/index.html');
	});
}