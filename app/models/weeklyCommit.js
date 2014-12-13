// app/models/weeklyCommit.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our message model
var weeklyCommitSchema = mongoose.Schema({
	contributor : Number,
	week 		: Number,
	add 		: Number,
	deletions 	: Number,
	commits 	: Number,
});

// methods ======================
// create the model for contributor and expose it to our app
module.exports = mongoose.model('WeeklyCommit', contributorSchema);
