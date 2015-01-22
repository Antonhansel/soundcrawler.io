var config = require('../config/config.json');
var request = require('request');

exports.checkToken = function(req, res, next){
    if (req.body.token == config.slack.token)
        return next();
    else res.end();
}

exports.testLoginEpitech = function(req, res, next){
    var logins = config.epitech.logins;
    var found = false;
    for (var i = 0; i < logins.length; i++){
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

exports.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}
