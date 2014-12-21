// app/routes.js
var config = require('../config/config.json');
var request = require('request');
var slack = require('./slack.js');
var weeklyCommit = require('./weeklyCommit.js');
var contributors = require('./contributor.js');
var middlewares = require('./middlewares.js');
var soundcrawler = require('./soundcrawler.js');
var url = require('url');

module.exports = function(app, passport) {
    app.get('/', function(req, res){
        var url_parts = url.parse(req.url, true);
        var query = url_parts.query;
        res.render('index.ejs');
    });

    app.get('/logout', logOut);
    //////////////////////////////////////
    //////////////LOGIN///////////////////
    //////////////////////////////////////
    app.get('/login', function(req, res) {
        res.render('login.ejs', { message: req.flash('loginMessage') }); 
    });
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/stats', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
    //////////////////////////////////////
    //////////////SIGNUP//////////////////
    //////////////////////////////////////
    app.get('/signup', function(req, res) {
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });
    app.post('/signup', 
        middlewares.testLoginEpitech,
        passport.authenticate('local-signup', {
        successRedirect : '/stats', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
    //////////////////////////////////////
    ///////////////STATS//////////////////
    //////////////////////////////////////
    app.get('/stats', middlewares.isLoggedIn, function(req, res) {
        res.render('stats.ejs');
    });
    app.post('/commits', /*middlewares.isLoggedIn,*/ weeklyCommit.getCommits);
    app.post('/contributors', /*middlewares.isLoggedIn,*/ contributors.getContributors);
    ////////////////////////////////////
    ///////////// SLACK ////////////////
    ////////////////////////////////////
    app.post('/incoming', middlewares.checkToken, slack.saveMessage);
    ////////////////////////////////////
    ///////// SOUNDCRAWLER /////////////
    ////////////////////////////////////
    app.post('/crawlsoundcloud', soundcrawler.download);
};

function logOut(req, res){
        req.logout();
        res.redirect('/');    
}