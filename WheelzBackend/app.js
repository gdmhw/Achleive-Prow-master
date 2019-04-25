var express = require('express');
var path = require('path');
var options = require('./config/config.js');
var mysql = require('mysql');
var cookieParser = require('cookie-parser');
var logger = require('morgan');



//ROUTES
// All the different routes that are used for the API
var indexRouter = require('./routes/index');
var reservationRouter = require('./routes/reservation');
var manageRouter = require('./routes/manage');
var accountRouter = require('./routes/account');
var bikeRouter = require('./routes/bike');
var dockRouter = require('./routes/dock');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Allow cross site access of the API
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


// Create a mysql middleware that will provide a mysql connection for api requests
app.use(function(req, res, next){
    res.locals.connection = mysql.createConnection({
        host: options.config.host,
        user: options.config.username,
        password: options.config.password,
        database: options.config.db
    });
    res.locals.connection.connect(function(err) {
        if (err) throw err;
        //console.log("Connected to DB!");
    });
    next();
});

//TODO:
// Setup daily tasks and execute with node-schedule
//  Daily tasks needed:
//      Assign bike ids for reservations for the day
//          This will need to consider what bike types are needed, then it will need to consider moving bikes as well
//      Daily bike shuffle report

// Add the routes to their actual uris
app.use('/api', indexRouter);
app.use('/api/v1/reservations', reservationRouter);
app.use('/api/v1/accounts', accountRouter);
app.use('/api/v1/manage', manageRouter);
app.use('/api/v1/bikes', bikeRouter);
app.use('/api/v1/docks', dockRouter);


console.log("got to the end of app.js");

module.exports = app;
