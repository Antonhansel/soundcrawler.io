var soundcrawler = require('soundcrawler');

exports.download = function(req, res){
	var crawler = new soundcrawler();
	crawler.download(req.body.url, false, function(err){
	    if (err){
	    	res.send(err);
	    	console.log("Error on crawling song: " + crawler.music);	
	    }
	    else {
	    	console.log("New song crawled: " + crawler.title);
	    	console.log("Url:" + crawler.downloadURL);
	    	res.send({'url' : crawler.downloadURL, 'title' : crawler.title + ".mp3", 'error' : 'none'});
	    }
	});
}