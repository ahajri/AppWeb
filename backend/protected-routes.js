var express = require('express'),
    jwt     = require('express-jwt'),
    config  = require('./config'),
    countries  = require('./countries');

var app = module.exports = express.Router();

var jwtCheck = jwt({
  secret: config.secret
});

function supportCrossOriginScript(req, res, next) {
	res.status(200);
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Content-Type");
	res.header("Access-Control-Allow-Methods",
			"POST, GET, OPTIONS, DELETE, PUT, HEAD");
	next();
};

app.use('/api/protected', jwtCheck);

app.get('/api/protected/random-country', supportCrossOriginScript,function(req, res) {
  res.status(200).send(countries.getRandomOne());
});
