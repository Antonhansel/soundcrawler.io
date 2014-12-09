// app/models/message.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our message model
var userSchema = mongoose.Schema({
	user_id				: String,
    channel_name      	: String,
    user_name   		: String,
    text  				: String,
    timestamp 			: Number, 
});

// methods ======================
// create the model for users and expose it to our app
module.exports = mongoose.model('Message', userSchema);