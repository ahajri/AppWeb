
var persons = require('../mock/persons.json');

exports.getRandomOne = function() {
	var totalAmount = persons.length;
	var rand = Math.ceil(Math.random() * totalAmount);
	return persons[rand];
}