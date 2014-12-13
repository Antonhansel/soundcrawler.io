var Contributor = require('./models/contributor.js');

exports.saveContributor = function(contributorToSave, callback){
    Contributor.findOne({id_git : contributorToSave.id}, function(err, contributor){
    	if (!contributor) contributor = new Contributor;
    	contributor.weekly = contributorToSave.weeks;
        contributor.contributions = contributorToSave.total;
        contributor.avatar_url = contributorToSave.author.avatar_url;
        contributor.html_url = contributorToSave.author.html_url;
        contributor.lastUpdate = Date();
		if (err){
			contributor.login = contributorToSave.author.login;
            contributor.id_git = contributorToSave.author.id;
        }
 		contributor.save(callback);
    });
}