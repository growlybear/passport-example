// app/routes.js

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/');
}

module.exports = function (app, passport) {

    // Home page
    app.get('/', function (req, res) {
        res.render('index.ejs');
    });


    // Login form
    app.get('/login', function (req, res) {
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile',    // redirect to the secure profile section
        failureRedirect: '/login',      // redirect back to the login page on error
        failureFlash: true              // send a flash message
    }));


    // Signup form
    app.get('/signup', function (req, res) {
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
    }));


    // Profile page
    app.get('/profile', isLoggedIn, function (req, res) {
        res.render('profile.ejs', {
            user: req.user  // get the user out of session and pass to template
        });
    });


    // Facebook routes
    app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
        successRedirect: '/profile',
        failureRedirect: '/'
    }));


    // Twitter routes
    app.get('/auth/twitter', passport.authenticate('twitter'));

    // handle the callback after twitter has authenticated the user
    app.get('/auth/twitter/callback', passport.authenticate('twitter', {
        successRedirect: '/profile',
        failureRedirect: '/'
    }));


    // Google routes
    app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

    // handle the callback after google has authenticated the user
    app.get('/auth/google/callback', passport.authenticate('google', {
        successRedirect: '/profile',
        failureRedirect: '/'
    }));



    // Logout page
    app.get('/logout', function (req, res) {
        req.logout();       // default logout method provided by passport
        res.redirect('/');
    });
};
