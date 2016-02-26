var express = require('express'), _ = require('lodash'), config = require('./config'), jwt = require('jsonwebtoken');

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
app.post('/users', supportCrossOriginScript,
		function(req, res) {
			if (!req.body.username || !req.body.password) {
				return res.status(400).send(
						"You must send the username and the password");
			}
			if (_.find(users, {
				username : req.body.username
			})) {
				return res.status(400).send(
						"A user with that username already exists");
			}

			var profile = _.pick(req.body, 'username', 'password', 'extra');
			profile.id = _.max(users, 'id').id + 1;

			users.push(profile);

			res.status(201).send({
				id_token : createToken(profile)
			});
		});

// Used for login function and creating web session
app.post('/sessions/create', supportCrossOriginScript, function(req, res) {
	if (!req.body.username || !req.body.password) {
		return res.status(400).send(
				"You must send the username and the password");
	}

	// get User from database
	var user = null;// _.find(users, {username: req.body.username});
	secDb.
	documents.
	query(
			  q.where(
					  q.value("username", req.body.username),
					  q.value("username", req.body.password)
					   
			  )
			)
		.stream()
			.on("data", function(document) {
		user=document;
		console.log(user.length);
		if(document){
			return res.status(401).send("The username or password don't match");
		}else{
			res.status(201).send({
				id_token : createToken(user),
				data:user
			});
		}
	}).on("error", function(error) {
		console.error(error);
		return res.status(505).send(error);
	})
	

});
