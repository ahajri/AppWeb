var express = require('express'), _ = require('lodash'), config = require('./config'), jwt = require('jsonwebtoken');

var userService = require('./service/UserService');

var marklogic = require("marklogic");
var secConn = require("./config/secConfig.js").connection;

var secDb = marklogic.createDatabaseClient(secConn);

var q = marklogic.queryBuilder;

var app = module.exports = express.Router();



function supportCrossOriginScript(req, res, next) {
	res.status(200);
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Content-Type");
	res.header("Access-Control-Allow-Methods",
			"POST, GET, OPTIONS, DELETE, PUT, HEAD");
	next();
}

function createToken(user) {
	return jwt.sign(_.omit(user, 'password'), config.secret, {
		expiresInMinutes : 60 * 5
	});
}

// insert User
app.post('/users/create', supportCrossOriginScript,
		function(req, res) {
			if (!req.body.username || !req.body.password) {
				return res.status(400).send(
						"You must send the username and the password");
			}
			if (!!userService.findUser(secDb, req, res, q)) {
				return res.status(400).send(
						"A user with that username already exists");
			} else {
				userService.saveUser(secDb, req, res)
			}
		});

// Used for login function and creating web session
app.post('/sessions/create', supportCrossOriginScript, function(req, res) {
	if (!req.body.username || !req.body.password) {
		return res.status(400).send(
				"You must send the username and the password");
	}
	// get User from database
	var user = null;
	secDb.documents.query(
			q.where(q.collection("AuthCollection"), q.value("username",
					req.body.username), q.value("password", req.body.password)

			)).result(function(documents) {
				var size=documents.length;
				if(size === 1){
					user = JSON.stringify(documents[0].content);
					res.status(200).send({
						id_token : jwt.sign(_.omit(user, 'password'), config.secret, {
							expiresInMinutes : 60 * 5
						}),
						"count" : size,
						"content" : JSON.stringify(documents)
					})
				}else{
					res.status(400).send('Username & password does not match');
				}
		
	}, function(error) {
		console.log(error);
		res.status(500).send(error);
	});
});