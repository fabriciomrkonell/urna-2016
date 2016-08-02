'use strict';

var express = require('express'),
    path = require('path'),
    routes_index = require('./routes/vote'),
    app = express(),
    server = require('http').Server(app),
    mongoose = require('mongoose'),
    db = mongoose.connection,
    bodyParser = require('body-parser'),
    Vote = require('./models/vote');

mongoose.connect('mongodb://localhost/schroeder-2016');

db.on('error', function(){
  console.log('Database: error.');
}).once('open', function() {
  console.log('Database: success.');
});

app.use(express.static(path.join(__dirname, '/')));
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/app', routes_index);

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'tcc.fabricioronchi.com:5000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

var server = server.listen(5000, function(){
	console.log('WEB started.');
});
