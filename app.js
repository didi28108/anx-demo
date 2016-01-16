var express = require('express');
var app = express();
var port = process.env.PORT || 3000;

var morgan = require('morgan');
app.use(morgan('dev'));

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());

var mongoose = require('mongoose');


app.use('/', function (req, res) {
	res.send('anx-demo!');
});

app.listen(port);
console.log('Anx-demo server running on port ' + port);