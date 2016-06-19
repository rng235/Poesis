/*------------------------------------------------------------






 -----------------------------------------------------------*/

//-------------------------SETUP CODE-------------------------
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var unirest = require('unirest');

//Require files
require('./db.js');
require('./auth');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

//----------authentication setup----------
var session = require('express-session');
var sessionOptions = {
    secret: 'abc',
    resave: true,
    saveUninitialized: true
};

app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next){
    //middleware adds req.user context to every template
    res.locals.user = req.user;
    next();
});
//------------------------------------------

//===============================

//proxy for site that doesn't have CORS headers
app.use('/proxy', function(req, res) {
    //var searchAuthor = req.url.replace('/', '');
    console.log("Running Proxy");
    var url = 'http://poetrydb.org/authors';
    req.pipe(request(url)).pipe(res);
});
//===============================

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

require('./db.js');

var mongoose = require('mongoose');
var EPoem = mongoose.model('EPoem');
var userPoem = mongoose.model('userPoem');
//var favoriteList = mongoose.model('favoriteList');
var userList = mongoose.model('userList');
//-------------------------SETUP CODE END-------------------------


app.use('/', routes);
app.use('/users', users);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;

