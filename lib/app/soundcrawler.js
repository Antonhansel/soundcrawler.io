var soundcrawler = require('soundcrawler');
var async = require('async');
var cheerio = require('cheerio');
var request = require('request');

exports.download = function(req, res){
	var crawler = new soundcrawler();
	if (req.body.url.indexOf('/likes') > -1){
		extractSongs(req.body.url, function(err, result){
			if (err && !result){
				console.log('Error crawling songs from ' + req.body.url + ' : ' + err);
				return res.send({'error' : 'Cannot crawl this page'});
			}
			else {
				result.splice(0,1);
				console.log(result);
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
	    	callback(null, err);
	    	console.log("Error on crawling song: " + crawler.music);
	    }
	    else {
	    	console.log("Song crawled: " + crawler.title);
	    	console.log("Url:" + crawler.downloadURL);
	    	callback(null, {'url' : crawler.downloadURL, 'title' : crawler.title + ".mp3", 'error' : 'none'});
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
				// var song = {
				// 	'url' : '',
				// 	'title' : '',
				// 	'artist': ''
				// };
				var url = 'http://soundcloud.com'
				url += data.substring(data.indexOf('href=\"')+6,data.indexOf('</a>'));
				// song.title = song.url;
				url = url.substring(0, url.indexOf('\">'));
				// song.title = song.title.substring(song.title.indexOf('\">')+2, song.title.length);
				// song.artist = data.substring(0, data.lastIndexOf('</a>'));
				// song.artist = song.artist.substring(song.artist.lastIndexOf('\">')+2, song.artist.length);
				songs.push(url);
			});
			callback(null, songs);
		}
		else callback(error, null);
	});
}
