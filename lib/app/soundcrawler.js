var soundcrawler = require('soundcrawler');
var async = require('async');
var cheerio = require('cheerio');
var request = require('request');

exports.download = function(req, res){
	var crawler = new soundcrawler();
	if (req.body.url.indexOf('/likes') > -1){
		extractSongs(req.body.url, function(err, result){
			if (err || !result){
				console.log('Error crawling songs from ' + req.body.url + ' : ' + err);
				return res.send({'error' : 'Cannot crawl this page'});
			}
			else {
				result.splice(0,1);
				async.map(result, launchCrawler, function(err, results){
					// if (err) res.send(err);
					// else
					res.send(results);
				});
			}
		});
	} else {
		launchCrawler(req.body.url, function(err, results){
			if (err) res.send(err);
			else res.send(results);
		});
	}
}

var launchCrawler = function(url, callback){
	var crawler = new soundcrawler();
	crawler.download(url, false, function(err){
		if (err){
			console.log("Error on crawling song: " + crawler.music);
	    	callback(null, err);
	    }
	    else {
	    	console.log("Song crawled: " + crawler.title);
	    	console.log("Url:" + crawler.downloadURL);
	    	console.log(filename);
	    	callback(null, {'url' : crawler.downloadURL, 'title' : crawler.title, 'error' : 'none', 'filename' : crawler.fileName + ".mp3"});
	    }
	});
}

var extractSongs = function(url, callback){
	console.log("Extracting songs of /likes page...");
	var options = {
		url : url,
		headers : {
			Accept: '*/*',
			'User-Agent' : this.useragent,
		}
	};
	request(options, function(error, response, html){
		if (!error && response.statusCode == 200){
			var songs = [];
			var $ = cheerio.load(html);
			$('article').filter(function(i, el) {
				var data = $(el).html();
				var url = 'http://soundcloud.com'
				url += data.substring(data.indexOf('href=\"')+6,data.indexOf('</a>'));
				url = url.substring(0, url.indexOf('\">'));
				songs.push(url);
			});
			callback(null, songs);
		}
		else callback(error, null);
	});
}
