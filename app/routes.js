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
    // app.post('/login', 'do all our passport stuff here');

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


    // Logout page
    app.get('/logout', function (req, res) {
        req.logout();       // default logout method provided by passport
        res.redirect('/');
    });
};
