// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var User            = require('../app/models/user');

// expose this function to our app using module.exports
module.exports = function(passport) {

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use('local-login', new LocalStrategy({
        usernameField : 'login_x',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, login_x, password, done){
        User.findOne({ 'local.login_x' :  login_x }, function(err, user) {
            if (err) return done(err);
            if (!user) return done(null, false, req.flash('loginMessage', 'No user found.'));
            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
            return done(null, user);
        });
    }));

    passport.use('local-signup', new LocalStrategy({
        usernameField : 'login_x',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, login_x, password, done){
        console.log(login_x);
        process.nextTick(function(){
        User.findOne({ 'local.login_x' :  login_x }, function(err, user){
            if (err) return done(err);
            if (user) {
                return done(null, false, req.flash('signupMessage', 'This user is already registered.'));
            } else {
                var newUser            = new User();
                newUser.local.login_x  = login_x;
                newUser.local.password = newUser.generateHash(password);
                newUser.save(function(err) {
                    if (err) throw err;
                    return done(null, newUser);
                });
            }
        });    
        });
    }));

};