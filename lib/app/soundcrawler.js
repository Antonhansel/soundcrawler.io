var soundcrawler = require('soundcrawler');

exports.download = function(req, res){
	var crawler = new soundcrawler();
	console.log(req.body);
	crawler.download(req.body.url, false, function(err){
		console.log("New song crawled!");
	    if (err) res.send(err);
	    else {
	    	res.send({'url' : crawler.downloadURL, 'title' : crawler.title, 'error' : 'none'});
	    }
	});
}