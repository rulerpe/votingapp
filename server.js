var express = require('express'),
	app		= express(),
	bodyParser =require('body-parser'),
	morgan	= require('morgan'),
	mongoose	= require('mongoose'),
	config	= require('./config'),
	jwt		= require('jsonwebtoken'),
	User	= require('./app/models/user'),
	Votes	= require('./app/models/vots.js'),	
	path 	= require('path');

mongoose.connect(config.database);
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

app.use(function(req, res, next){
	res.setHeader('Access-Control-Allow-Origin','*');
	res.setHeader('Access-Control-Allow-Methods','GET, POST');
	res.setHeader('Access-Control-Allow-Headers','X-Requested-with, content-type, Authorization');
	next();
});

app.use(morgan('dav'));
app.use(express.static(__dirname + '/public'));

var apiRoutes = require('./app/routes/api')(app, express);
app.use('/api', apiRoutes);

app.get('*', function(req, res){
	res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
})



app.listen(config.port);
console.log('voting app rocks!!' + config.port);