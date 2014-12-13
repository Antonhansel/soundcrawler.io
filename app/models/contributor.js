// app/models/contributor.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our message model
var contributorSchema = mongoose.Schema({
	login				: String,
    contributions      	: Number,
    avatar_url			: String,
    html_url			: String,
    id_git				: String
});

// methods ======================
// create the model for contributor and expose it to our app
module.exports = mongoose.model('Contributor', contributorSchema);
