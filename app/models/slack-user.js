var mongoose = require('mongoose');

var slackUserSchema = mongoose.Schema({
	user_id		: Number,
	user_name	: String
});

module.exports = mongoose.model('SlackUser', userSchema);