/******************************************************
 * All Paws On Deck
 * CS 506
 * Server.js
 * Provides key server functionality using Express.  Brings in basic tools
 * for tracking.
 * 
 * Initial structure for key server components taken from 
 * https://scotch.io/tutorials/easy-node-authentication-setup-and-local#undefined
 * 
 *****************************************************/
// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = 8080 //process.env.PORT || 80;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

//Added by Todd
var path = require('path');


//Use this address for remote database:  'mongodb://jinglin:abc123456@ds015953.mlab.com:15953/apod' 
mongoose.connect('mongodb://localhost:27017/apodDB', { useNewUrlParser: true }, err=> {
    if(err) {
        console.log('connection to mongo.db threw the following error ' + err);
    } else {
        console.log('Connection to mongo.db succesful')
    }

}); // connect to our database
//mongoose.connect('mongodb://localhost:27017/apodDB');

app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms
app.use(bodyParser.json());

require('./controller/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console


//Added by todd for static distribution of public items
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname,  path.join('public', 'stylesheets'))));
app.use('/js', express.static(path.join(__dirname,  path.join('public', 'tablefilter'))));
app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'allpawsondeckbestpawsondeck' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./controller/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
var server = app.listen(port);

console.log('The magic happens on port ' + port);

module.exports = server;
