var WeeklyCommit = require('./models/weeklyCommit.js');
var async = require('async');

exports.saveCommits = function(week, callback){
	var contributor = this.contributor;
	WeeklyCommit.findOne({week : week.w}, function(err, weeklyCommit){
		if (!weeklyCommit) weeklyCommit = new WeeklyCommit;	
			weeklyCommit.add = week.a;
			weeklyCommit.del = week.d;
			weeklyCommit.commits = week.c;
			weeklyCommit.contributor = contributor;
			weeklyCommit.week = week.w;
			weeklyCommit.save(callback);
		});
}

exports.getCommits = function(req, res){
	if (!req.body.commits && !req.body.contributor){
		WeeklyCommit.find({}, function(err, results){
			if (err) {throw err; return res.send({error : "Unable to retrieve weekly commits"})}
			else return res.send(results);
		});
	}
	if (req.body.commits){
		async.map(req.body.commits, function(commit, callback){
			WeeklyCommit.findById(commit, callback)
		}, function(err, results){
			if (err) throw err;
			return res.send(results);
		});
	}
	else if (req.body.contributor){
		async.map(req.body.contributor, function(id, callback){
			WeeklyCommit.findOne({contributor : id}, callback)
		}, function(err, results){
			if (err) throw err;
			return res.send(results);
		});
	}
}