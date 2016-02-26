var dev = {
	database : "InvestDB", // Each connection can specify its own database
	host : "localhost", // The host against which queries will be run
	port : 8000, // By default port 8000 accepts Client API requests
	user : "invest", // A user with at least the rest-writer role
	password : "invest", // Probably not your password
	authType : "DIGEST" // The default auth
}




module.exports = {
	connection : dev,
}