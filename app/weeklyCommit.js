var WeeklyCommit = require('./models/weeklyCommit.js');

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