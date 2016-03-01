var express = require('express');
var personService = require('./service/personService.js');
var countries = require('./countries');
var countryList = require('./countries.json');
var async = require('async');
var node_xj = require("xls-to-json");
var fs = require("fs");
var Converter = require("csvtojson").Converter;

var marklogic = require("marklogic");
var secConn = require("./config/secConfig.js").connection;

var db = marklogic.createDatabaseClient(secConn);

var qb = marklogic.queryBuilder;
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

app.get('/api/csv2json', supportCrossOriginScript, function(req, res) {
	var index = 0;
	var convertedJson = JSON.stringify({});
	async.series([
	// Check and Load user
	function(callback) {
		// convert xls 2 json
		var csvFileName = "../doc/csv/education_properties.csv";
		// new converter instance
		var converter = new Converter({});

		// end_parsed will be emitted once parsing finished

		converter.fromFile(csvFileName, function(err, result) {
			if (err) {
				callback(err);
			}
			if (result) {
				convertedJson = JSON.stringify(result);
				callback();
			}
		});
		// end_parsed will be emitted once parsing finished

	}, function(callback) {
		console.log('data size: ' + convertedJson.length);
		// save file in MarkLogic
		db.documents.write({
			uri : '/properties/education_properties.json',
			contentType : 'application/json',
			collections : [ 'ttp://localhost/StatCollection' ],
			content : convertedJson
		}).result(function(response, error) {
			if (error) {
				console.log(error);
				callback(error);
			} else {
				index = 2;
				callback()
			}
		});

	} ], function(err) {
		if (err) {
			return res.status(500).send(err);
		}
		if (index === 2) {
			return res.status(200).send("csv converted");
		}
	});

});

app.get('/api/search-countries/:cca3', supportCrossOriginScript, function(req,
		res) {
	var found = [];
	if (req.params.cca3 === null) {
		res.status(200).send(countryList);
	}
	for (var int = 0; int < countryList.length; int++) {
		var json = JSON.stringify(countryList[int]);
		if (countryList[int].name.common.toLowerCase().startsWith(
				req.params.cca3.toLowerCase())) {
			found.push(json);
		}
	}

	res.status(200).send(found);
});

app.get('/api/educprop/', supportCrossOriginScript, function(req, res) {
	db.documents.query(qb.where(qb.parsedFrom('SE.ENR.PRIM.FM.ZS'))

	).result(function(results) {
		return res.status(200).send(results);
	});

})

app.get('/api/persons/:country', supportCrossOriginScript,
		function(req, res) {
			var country = req.params.country;
			var SparqlClient = require('sparql-client');
			var util = require('util');
			var endpoint = 'http://localhost:8008/v1/graphs/sparql';

			// Get the leaderName(s) of the given citys
			// if you do not bind any city, it returns 10 random leaderNames
			var query = "PREFIX dbb: <http://dbpedia.org/resource/> "
					+ "PREFIX foaf: <http://xmlns.com/foaf/0.1/> "
					+ "PREFIX onto: <http://dbpedia.org/ontology/> " +
					"SELECT * "
					+ "WHERE { ?person onto:birthPlace dbb:France } "
					+ "SELECT * WHERE { ?person onto:birthPlace dbb:" + country
					+ " } ";
			var client = new SparqlClient(endpoint);
			console.log("Query to " + endpoint);
			console.log("Query: " + query);
			client.query(query)
			// .bind('city', 'db:Chicago')
			// .bind('city', 'db:Tokyo')
			// .bind('city', 'db:Casablanca')
			.bind('birthPlace', '<http://dbpedia.org/resource/France>')
					.execute(function(error, results) {
						if (error) {
							return res.status(500).send(error);
						} else {
							return res.status(200).send(results);
						}

					});

		})

app.get('/api/find-profile', supportCrossOriginScript, function(req, res) {
	res.status(200).send(JSON.stringify(personService.getRandomOne()));
});
app.get('/api/countries', supportCrossOriginScript, function(req, res) {
	res.status(200).send(countries.getAllCountries());
});