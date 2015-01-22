var soundcrawler = require('soundcrawler');
var async = require('async');
var cheerio = require('cheerio');
var request = require('request');
var config = require('../config/config.json');
var zlib = require('zlib');

exports.download = function(req, res){
	if (req.body.url.split('/').length != 5){
		extractSongs(req.body.url, function(err, result){
			if (err || !result){
				console.error('Error crawling songs from ' + req.body.url + ' : ' + err);
				return res.send({'error' : 'Cannot crawl this page'});
			}
			else {
				async.map(result, launchCrawler, function(err, results){
					res.send(results);
				});
			}
		});
	} else {
		launchCrawler(req.body.url, function(err, results){
			res.send(results);
		});
	}
}

var launchCrawler = function(url, callback){
	var crawler = new soundcrawler();
	crawler.download(url, false, function(err){
		if (err){
			console.error("Error on crawling song: " + crawler.music);
			callback(null, err);
		}
		else {
			console.log("Song crawled: " + crawler.title);
			callback(null, {'url' : crawler.downloadURL, 'title' : crawler.title, 'error' : 'none', 'filename' : crawler.fileName + ".mp3"});
		}
	});
}

var extractSongs = function(url, callback){
	var options = {
		url : url,
		headers : {
			Accept: 'application/json, text/javascript, */*; q=0.01',
			'User-Agent' : config.useragent,
		}
	};
	request(options, function(error, response, html){
		if (!error && response.statusCode == 200){
			options = {
				url : url,
				headers : {
					Accept: 'application/json, text/javascript, */*; q=0.01',
					'User-Agent' : config.useragent,
					'Accept-Encoding': 'gzip, deflate, sdch',
					'Accept-Language': 'en-US,en;q=0.8,fr;q=0.6'
				}
			};
			var songs = [];
			var userId = html.substring(html.indexOf('\"id\":')).split(':')[1].split(',')[0];
			options.url = 'https://api-v2.soundcloud.com/profile/soundcloud%3Ausers%3A' + userId + '?limit=' + config.deepness + '&offset=0&linked_partitioning=1';
			var req = request.get(options);

			req.on('response', function(res) {
				var chunks = [];
				res.on('data', function(chunk) {
					chunks.push(chunk);
				});

				res.on('end', function() {
					var buffer = Buffer.concat(chunks);
					zlib.gunzip(buffer, function(err, decoded) {
						if (err) return callback(err, null);
						var json = JSON.parse(decoded.toString()).collection;
						for (var i = 0; i < json.length; i++){
							if (json[i].type == 'playlist-repost' || json[i].type == 'playlist'){
								for (var j = 0; j < json[i].playlist.tracks.length; j++){
									songs.push(json[i].playlist.tracks[j].permalink_url);
								}
							// } else if (json[i].type == 'song' || json[i].type == 'song-repost') {
							// 	//
							} else if (json[i].type == 'track' || json[i].type == 'track-repost') {
								songs.push(json[i].track.permalink_url);
							}
						}
						return callback(null, songs);
					});
				});
			});
			req.on('error', function(err) {
				return callback(err, null);
			});
		}
		else return callback(error, null);
	});
}
