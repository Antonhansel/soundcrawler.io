// server.js
var config = require('./lib/config/config.json');
// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var flash    = require('connect-flash');

var morgan       = require('morgan');
var bodyParser   = require('body-parser');
var path 		 = require('path'); 

// Setting git data refresh

// configuration ===============================================================
// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser()); // get information from html forms

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(express.static(path.join(__dirname, 'public'))); // to get local files
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./lib/app/routes.js')(app); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('Server listening on port ' + port);
