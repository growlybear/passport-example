// config/passport.js

var LocalStrategy = require('passport-local').Strategy;

// load up the user model
var User = require('../app/models/user');

// expose this function to our app using module.exports
module.exports = function (passport) {

    // ========================================================================
    // passport session setup
    // ========================================================================
    // required for persistent login sessions
    // passport needs to be able to serialize/deserialize users out of session

    // serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    // deserialize the user
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    // ========================================================================
    // LOCAL SIGNUP
    // ========================================================================
    // use named strategies since we have one for login and one for signup
    // by default, if there were no name, it would just be called "local"

    passport.use('local-signup', new LocalStrategy({

        // NOTE by default, local strategy uses username and password
        //      - we'll override that with email and password
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true     // pass the entire request to the callback

    }, function (req, email, password, done) {

        // find a user whose email is the same as the form's email
        // ie. see if the user already exists
        User.findOne({ 'local.email': email }, function (err, user) {

            if (err) return done(err);

            var newUser;

            // check to see if that email has already been taken
            if (user) {
                return done(null, false, req.flash('signupMessage', 'That email is already registered'))
            }
            else {

                // if there is no user with that email already, create the user
                newUser = new User();

                // set the user's local credentials
                newUser.local.email = email;
                newUser.hashPassword(password); // NOTE sets local.password on newUser

                // save the user
                newUser.save(function (err) {
                    if (err) throw err;     // FIXME? need better error handling

                    return done(null, newUser);
                });
            }
        });
    }));


    // ========================================================================
    // LOCAL LOGIN
    // ========================================================================
    // use named strategies since we have one for login and one for signup
    // by default, if there were no name, it would just be called "local"

    passport.use('local-login', new LocalStrategy({

        // NOTE by default, local strategy uses username and password
        //      - we'll override that with email and password
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true     // pass the entire request to the callback

    }, function (req, email, password, done) {

        // find a user whose email is the same as the form's email
        // ie. see if the user already exists
        User.findOne({ 'local.email': email }, function (err, user) {

            if (err) return done(err);

            // if no user is found, return the message
            if (!user) {
                return done(null, false, req.flash('loginMessage', 'No user found.'));
            }

            // if the user is found, but the password is wrong
            if (!user.validPassword(password)) {
                return done(null, false, req.flash('loginMessage', 'Oops! Incorrect credentials.'));
            }

            // all is well, return successful user
            return done(null, user);
        });
    }));
};
