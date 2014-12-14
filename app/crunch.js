//crunch.js
var WeeklyCommit = require('./models/weeklyCommit.js')
var Contributors = require('./models/contributor.js');

exports.commits = function(req, res){
	WeeklyCommit.find({}, function(err, results){
		if (err) {throw err; res.send({error : "Unable to retrieve weekly commits"})}
		else res.send(results);
	});
}

exports.contributors = function(req, res){
	Contributors.find({}, function(err, results){
		if (err) {throw err; res.send({error : "Unable to get contributor"})}
		else res.send(results);
	});
}