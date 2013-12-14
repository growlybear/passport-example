// server.js

// Set up =====================================================================
var express  = require('express');
var app      = express();
var http     = require('http');
var path     = require('path');

var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');


// Config =====================================================================
var dbConfig = require('./config/database.js');
mongoose.connect(dbConfig.url); // connect to the database

// require('./config/passport')(passport); // pass pasport for configuration

app.set('title', 'Passport example application');

app.configure(function () {

    app.set('port', process.env.PORT || 3000);

    // set up our express application
    app.use(express.logger('dev'));
    app.use(express.cookieParser('cookie secret here'));
    app.use(express.favicon());

    app.use(express.json());            // replaces bodyParser()
    app.use(express.urlencoded());      // replaces bodyParser()
    app.use(express.methodOverride());

    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.static(path.join(__dirname, 'app', 'components')));

    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, 'views'));

    // required for passport
    app.use(express.session({ secret: 'twasbrilligandtheslithythovesdid'}));
    app.use(passport.initialize());
    app.use(passport.session());        // persistent login sessions
    app.use(flash());                   // for flash messages stored in session

    // development only
    if ('development' == app.get('env')) {
        app.use(express.errorHandler());
    }
});


// Routes =====================================================================
// pass the app and passport to our routing function, once they're both
// fully configurede
require('./app/routes.js')(app, passport);


// and ... GO! ================================================================
http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
