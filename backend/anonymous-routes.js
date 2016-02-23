var express = require('express'), 
countries = require('./countries');

var app = module.exports = express.Router();

function supportCrossOriginScript(req, res, next) {
	res.status(200);
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Content-Type");
	res.header("Access-Control-Allow-Methods",
			"POST, GET, OPTIONS, DELETE, PUT, HEAD");
	next();
};

app.get('/api/random-quote', supportCrossOriginScript, function(req, res) {
	res.status(200).send(countries.getRandomOne());
});

app.get('/api/search-countries/:cca3', supportCrossOriginScript, function(req, res) {

	console.log(req.params.cca3);
	
	res.status(200).send(countries.getByCca3(req.params.cca3));

});