var config = require('../config'),
_ = require('lodash'), jwt = require('jsonwebtoken');

var self;

exports.saveUser = function(db, req, res) {
	self = this;
	var data = {
		"username" : req.body.username,
		"password" : req.body.password
	};
	db.documents.write({
		uri : '/auth/' + data.username + '.json',
		contentType : 'application/json',
		collections : [ 'AuthCollection' ],
		content : data
	}).result(function(response, error) {
		if (error) {
			console.log(error);
			res.status(500).send(error);
		} else {
			var profile = _.pick(req.body, 'username', 'password', 'extra');
			res.status(201).send({
				id_token : jwt.sign(_.omit(profile, 'password'), config.secret, {
					expiresInMinutes : 60 * 5
				}),
				data:response
			});
		}
	});
}

createToken = function(user) {
	return jwt.sign(_.omit(user, 'password'), config.secret, {
		expiresInMinutes : 60 * 5
	});
}

exports.findUser = function(db, req, res, q) {

	db.documents.query(q.where(q.byExample({
		"username" : req.body.username
	}))).stream().on("data", function(document) {
		console.log(document);
		res.status(200).send(document);
	}).on("error", function(error) {
		console.log(error);
		res.status(500).send(error);
	});
}