var Message = require('./models/message.js');

exports.saveMessage = function(req, res){
	var message = new Message();
	message.channel_name = req.body.channel_name;
	message.user_name = req.body.user_name;
	message.text = req.body.text;
	message.timestamp = req.body.timestamp;
	message.save(function(err){
		if (err) throw err;
		return;
	});
}