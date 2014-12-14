var Contributor = require('./models/contributor.js');
var weeklyCommit = require('./weeklyCommit.js');
var async = require('async');

exports.saveContributor = function(contributorToSave, callback){
	Contributor.findOne({id_git : contributorToSave.author.id}, function(err, contributor){
		async.map(contributorToSave.weeks, weeklyCommit.saveCommits.bind({ contributor : contributorToSave.author.id}), function(err, results)
		{
			if (!contributor) contributor = new Contributor;
			var found;
			for (var i = 0; i < results.length; i++){
				found = false;
				for (var j = 0; j < contributor.weekly.length; j++){
					if (contributor.weekly[j] = results[i]._id) found = true;
				}
				if (!found) contributor.weekly.push(results[i]._id);
			}
			contributor.contributions = contributorToSave.total;
			contributor.avatar_url = contributorToSave.author.avatar_url;
			contributor.html_url = contributorToSave.author.html_url;
			contributor.lastUpdate = Date();
			contributor.login = contributorToSave.author.login;
			contributor.id_git = contributorToSave.author.id;
			contributor.save(callback);
		});
	});
}

exports.getContributors = function(req, res){
	Contributors.find({}, function(err, results){
		if (err) {throw err; res.send({error : "Unable to get contributor"})}
		else res.send(results);
	});
}