// app/routes.js
var request = require('request');
var slack = require('./slack.js');

module.exports = function(app, passport) {
    app.get('/', function(req, res) { res.render('index.ejs');});

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
        testLoginEpitech,
        passport.authenticate('local-signup', {
        successRedirect : '/stats', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    app.get('/stats', isLoggedIn, function(req, res) {
        res.render('stats.ejs');
    });

    app.get('/logout', logOut);

    ////////////////////////////////////
    ///////////// SLACK ////////////////
    app.post('/incoming', checkToken, slack.saveMessage);
};

function checkToken(req, res, next){
    if (req.body.token == "QxXkiXf3tFQDhAQa17hfQmS6")
        next();
}

function testLoginEpitech(req, res, next){
    var logins = ["ribeau_a", "chouag_m", "pensat_f", "davic_c", "roche_b", "chesse_m", 
    "sabot_t", "farabe_j"];
    var found = false;
    for (var i = 0; i < logins.length; logins++){
        if (logins[i] == req.body.login_x){
            found = true;
        }
    }
    if (found){    
        var url = "http://ws.paysdu42.fr/JSON/?action=login&auth_login="
        url += req.body.login_x;
        url += "&auth_password=";
        url += req.body.password_PPP;
        console.log(url);
        request(url, function(error, response, body){
            if (!error && response.statusCode == 200){
                var info = JSON.parse(body);
                if (info.error == "none")
                    return next();
            }
            else {
                req.flash('signupMessage', "Wrong tek credentials");
                res.redirect('/signup');
            }
        });
    } else {
        req.flash('signupMessage', "Login unauthorized");
        res.redirect('/signup');
    }
}

function logOut(req, res){
        req.logout();
        res.redirect('/');    
}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}
