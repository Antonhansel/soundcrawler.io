var async = require('async');
var branch = require('./branch.js');
var contributor = require('./contributor.js');
var config = require('../config/config.json');

var request = require('request'),
    options = {
    url: '',
    headers: {
        'User-Agent' : config.github_api.useragent,
        'Content-Type' : 'application/json'
    },
    'auth' : {'user' : config.github_api.token, 'pass': 'x-oauth-basic'}
};

exports.refreshData = function(){
    async.parallel({
        getBranchs: function(callback){
            options.url = config.github_api.url + "/repos/" + config.github_api.owner + "/"+ config.github_api.repository + "/branches";
            request.get(options, function(err, response, body){
            callback(err, JSON.parse(response.body));
            })
        },
        getContributors: function(callback){
            options.url = config.github_api.url + "/repos/" + config.github_api.owner + "/"+ config.github_api.repository + "/stats/contributors";
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