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

function saveBranch(branch, callback){
    
}

function saveContributor(contributor, callback){
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
                    }
                );
            }
        }
    );
}