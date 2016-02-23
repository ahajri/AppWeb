var logger          = require('morgan'),
    cors            = require('cors'),
    http            = require('http'),
    express         = require('express'),
    errorhandler    = require('errorhandler'),
    dotenv          = require('dotenv'),
    cluster 		= require('cluster'),
    fs				= require('fs'),
    bodyParser      = require('body-parser');

var app = express();

dotenv.load();

// Parsers
// old version of line
// app.use(bodyParser.urlencoded());
// new version of line
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use(function(err, req, res, next) {
  if (err.name === 'StatusError') {
    res.send(err.status, err.message);
  } else {
    next(err);
  }
});

if (process.env.NODE_ENV === 'development') {
  app.use(express.logger('dev'));
  app.use(errorhandler())
}

app.use(require('./anonymous-routes'));
app.use(require('./protected-routes'));
app.use(require('./user-routes'));

var port = process.env.PORT || 8020;

var server = app.listen(port, function (err) {
	if (cluster.isMaster) {
		console.log('Master process ...');
	}
	if (cluster.isWorker) {
		console.log('Worker process ...');
	}
	var cpuCount = require('os').cpus().length;
	console.log('CPU nodes = ' + cpuCount);
	console.log('listening in http://localhost:' + port);
});

