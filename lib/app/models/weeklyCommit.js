// app/models/weeklyCommit.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our message model
var weeklyCommitSchema = mongoose.Schema({
	contributor : String,
	week 		: Number,
	add 		: Number,
	del 		: Number,
	commits 	: Number,
});

// methods ======================
// create the model for weeklycommit and expose it to our app
module.exports = mongoose.model('WeeklyCommit', weeklyCommitSchema);
