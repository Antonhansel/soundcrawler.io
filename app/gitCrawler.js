var async = require('async');
var branch = require('./branch.js');
var contributor = require('./contributor.js');

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

exports.refreshData = function(){
    async.parallel({
        getBranchs: function(callback){
            options.url = url + "/repos/" + owner + "/"+ repository + "/branches";
            request.get(options, function(err, response, body){
            callback(err, JSON.parse(response.body));
            })
        },
        getContributors: function(callback){
            options.url = url + "/repos/" + owner + "/"+ repository + "/stats/contributors";
            request.get(options, function(err, response, body){
            callback(err, JSON.parse(response.body));
            })
        }
    }, function(err, results){
        if (err) throw err;
        else {
            async.parallel({
                    saveBranchs : function(callback){
                        async.map(results.getBranchs, branch.saveBranch, callback);                       
                    },
                    saveContributors: function(callback){
                        async.map(results.getContributors, contributor.saveContributor, callback);
                    },
                }, function(err, results){
                    if (err) throw err;
                    }
                );
            }
        }
    );
}