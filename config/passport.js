// config/passport.js

var LocalStrategy    = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy  = require('passport-twitter').Strategy;
var GoogleStrategy   = require('passport-google-oauth').OAuth2Strategy;

// load up the user model
var User = require('../app/models/user');

// load the auth credentials
var authConfig = require('./auth');


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


    // ========================================================================
    // FACEBOOK LOGIN
    // ========================================================================
    // no need for named strategies here

    passport.use(new FacebookStrategy({

        // pull in credentials from auth.js file
        clientID    : authConfig.facebookAuth.clientID,
        clientSecret: authConfig.facebookAuth.clientSecret,
        callbackURL : authConfig.facebookAuth.callbackURL

    }, function (token, refreshToken, profile, done) {

        // asynchronous
        process.nextTick(function () {

            User.findOne({ 'facebook.id': profile.id }, function (err, user) {

                if (err) return done(err);

                // if the user is found, log them in
                if (user) {
                    return done(null, user);    // user found, all good
                }
                // otherwise, create a new user and log them in
                else {
                    var newUser = new User();

                    // set all of the facebook information in our user model
                    // set the user's facebook id
                    newUser.facebook.id = profile.id;
                    // save the token that facebook provides to the user
                    newUser.facebook.token = token;
                    // look at the passport user profile to see how names are returned
                    newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
                    // facebook can return multiple emails so we'll take the first
                    newUser.facebook.email = profile.emails[0].value;

                    // save our new user to the database
                    newUser.save(function (err) {
                        if (err) throw err;     // FIXME? better error handling

                        // if successful, return the new user
                        return done(null, newUser);
                    });
                }
            });
        });

    }));


    // ========================================================================
    // TWITTER LOGIN
    // ========================================================================
    // no need for named strategies here

    passport.use(new TwitterStrategy({

        // pull in credentials from auth.js file
        consumerKey   : authConfig.twitterAuth.consumerKey,
        consumerSecret: authConfig.twitterAuth.consumerSecret,
        callbackURL   : authConfig.twitterAuth.callbackURL

    }, function (token, tokenSecret, profile, done) {

        // asynchronous
        // ie. User.findOne won't fire until we have data back from Twitter
        process.nextTick(function () {

            User.findOne({ 'twitter.id': profile.id }, function (err, user) {

                if (err) return done(err);

                // if the user is found, log them in
                if (user) {
                    return done(null, user);    // user found, all good
                }
                // otherwise, create a new user and log them in
                else {
                    var newUser = new User();

                    // set all of the twitter information in our user model
                    newUser.twitter.id = profile.id;
                    newUser.twitter.token = token;
                    newUser.twitter.username = profile.username;
                    newUser.twitter.displayName = profile.displayName;

                    // save our new user to the database
                    newUser.save(function (err) {
                        if (err) throw err;     // FIXME? better error handling

                        // if successful, return the new user
                        return done(null, newUser);
                    });
                }
            });
        });

    }));

    // =========================================================================
    // GOOGLE ==================================================================
    // =========================================================================
    passport.use(new GoogleStrategy({

        clientID        : authConfig.googleAuth.clientID,
        clientSecret    : authConfig.googleAuth.clientSecret,
        callbackURL     : authConfig.googleAuth.callbackURL,

    },
    function(token, refreshToken, profile, done) {

        // make the code asynchronous
        // User.findOne won't fire until we have all our data back from Twitter
        process.nextTick(function() {

            // try to find the user based on their google id
            User.findOne({ 'google.id' : profile.id }, function (err, user) {
                if (err)
                    return done(err);

                if (user) {

                    // if a user is found, log them in
                    return done(null, user);
                } else {
                    // if the user isnt in our database, create a new user
                    var newUser          = new User();

                    // set all of the relevant information
                    newUser.google.id    = profile.id;
                    newUser.google.token = token;
                    newUser.google.name  = profile.displayName;
                    newUser.google.email = profile.emails[0].value; // pull the first email

                    // save the user
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });
        });

    }));

};
