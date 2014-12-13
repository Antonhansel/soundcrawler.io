var async = require('async');
var Branch = require('./models/branch.js');
var Contributor = require('./models/contributor.js');

var request = require('request'),
    token = "aea3b9b33ac8d1d9d6767ccbc324e195f99b82ee";
    url = "https://api.github.com",
    userAgent = "statTracker",
    repository = "statTracker";
    owner = "antonhansel"
    options = {
    url: '',
    headers: {
        'User-Agent' : 'statTracker',
        'Content-Type' : 'application/json'
    },
    'auth' : {'user' : token, 'pass': 'x-oauth-basic'}
};

function saveBranch(branchToSave, callback){
    Branch.findOne({name : branchToSave.name}, function(err, found){
        if (found){
            found.commit = JSON.stringify(branchToSave.commit);
            found.lastUpdate = Date();
            found.save(callback);
        }
        else {
            var branch = new Branch();
            branch.name = branchToSave.name;
            branch.commit = JSON.stringify(branchToSave.commit);
            branch.lastUpdate = Date();
            branch.save(callback);
        }
    });
}

function saveContributor(contributorToSave, callback){
    Contributor.findOne({id_git : contributorToSave.id}, function(err, found){
        if (found){
            found.contributions = contributorToSave.contributions;
            found.avatar_url = contributorToSave.avatar_url;
            found.html_url = contributorToSave.html_url;
            found.lastUpdate = Date();
            found.save(callback);
        }
        else {
            var contributor = new Contributor();
            contributor.login = contributorToSave.login;
            contributor.contributions = contributorToSave.contributions;
            contributor.avatar_url = contributorToSave.avatar_url;
            contributor.html_url = contributorToSave.html_url;
            contributor.id_git = contributorToSave.id;
            contributor.lastUpdate = Date();
            contributor.save(callback);
        }
    });
}

exports.refreshData = function(){
    async.parallel({
        getBranchs: function(callback){
            options.url = url + "/repos/" + owner + "/"+ repository + "/branches";
            request.get(options, function(err, response, body){
            callback(err, JSON.parse(response.body));
            })
        },
        getContributors: function(callback){
            options.url = url + "/repos/" + owner + "/"+ repository + "/contributors";
            request.get(options, function(err, response, body){
            callback(null, JSON.parse(response.body));
            })
        }
    }, function(err, results){
        if (err) throw err;
        else {
            async.parallel({
                    saveBranchs : function(callback){
                        async.map(results.getBranchs, saveBranch, callback);                       
                    },
                    saveContributors: function(callback){
                        async.map(results.getContributors, saveContributor, callback);
                    },
                }, function(err, results){
                    if (err) throw err;
                    }
                );
            }
        }
    );
}