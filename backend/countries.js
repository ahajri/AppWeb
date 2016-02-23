var countries = require('./countries.json');

exports.getRandomOne = function() {
	var totalAmount = countries.length;
	var rand = Math.ceil(Math.random() * totalAmount);
	return countries[rand];
}

exports.getByCca3 = function(code) {
	
	for (var int = 0; int < countries.length; int++) {
		var json = JSON.stringify(countries[int]);
		if (countries[int].cca3 === code) {
			return json;
		}
	}
	return {};

}

exports.getAllCountries = function() {
	return JSON.stringify(countries);
}