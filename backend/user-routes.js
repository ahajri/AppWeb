var express = require('express'), _ = require('lodash'), config = require('./config'), jwt = require('jsonwebtoken');

var userService = require('./service/UserService');

var marklogic = require("marklogic");
var secConn = require("./config/secConfig.js").connection;

var secDb = marklogic.createDatabaseClient(secConn);

var q = marklogic.queryBuilder;

var app = module.exports = express.Router();

// XXX: This should be a database of users :).
var users = [ {
	id : 1,
	username : 'gonto',
	password : 'gonto'
} ];

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
			if (!!userService.findUser(secDb,req,res,q)) {
				return res.status(400).send(
						"A user with that username already exists");
			}else{
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
	var user = null;// _.find(users, {username: req.body.username});
	secDb.documents.query(
			q.where(
					q.or(
						      q.word("username", req.body.username),
						      q.word("password", req.body.password)
						    )

			)).stream().on("data", function(document) {
				user = document;
				console.log(user);
				if (document.content=== {}) {
					return res.status(401).send(
							"The username or password don't match");
				} else {
					res.status(200).send({
						id_token : jwt.sign(_.omit(user, 'password'), config.secret, {
							expiresInMinutes : 60 * 5
						}),
						data : user
					});
				}
			}).on("error", function(error) {
				console.error(error);
				return res.status(505).send(error);
			})

});
