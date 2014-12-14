// app/models/branch.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our message model
var branchSchema = mongoose.Schema({
	name				: String,
    commit      		: Object,
    lastUpdate			: Date,
});

// methods ======================
// create the model for users and expose it to our app
module.exports = mongoose.model('Branch', branchSchema);