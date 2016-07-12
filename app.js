var express = require('express');
var app = express();
var port = process.env.PORT || 3000;

var morgan = require('morgan');
app.use(morgan('dev'));

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({'extended':'false'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());

var path = require('path');
app.use(express.static(path.join(__dirname + '/public')));
app.use('/public', express.static(path.join(__dirname, '/public')));
app.use('/bower_components', express.static(path.join(__dirname, '/bower_components')));

// setting up mongodb connection
var mongoose = require('mongoose');
var dbconfig = require('./config/db_conn');
mongoose.connect(dbconfig.url, function(err){
  if(err) console.log(err);
  else console.log('MongoDB connected! \nlink: ' + dbconfig.url);
});

// use the passport package
var passport = require('passport');
app.use(passport.initialize());

require('./config/passport')(passport);

// routes
require('./routes/index.js')(app, passport, __dirname);

var server = require('http').createServer(app);
server.listen(port, function () {
  console.log('Anx-demo server running on ' + port);
});
