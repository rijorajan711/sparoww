var createError = require('http-errors');
var express = require('express');
var path = require('path');
var session=require('express-session')
// var cors=require("cors")
var bodyParser=require("body-parser")
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var adminRouter = require('./routes/admin');
var userRouter = require('./routes/users');
var app = express();

var expressLayouts=require("express-ejs-layouts")
var db=require('./config/connection')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layout')


     
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/assets1')));

app.use(session({secret:"key",cookie:{maxAge:6000000},resave:false,saveUninitialized:true}));

// app.use(cors())
app.use(expressLayouts);
app.use('/', userRouter);
app.use('/admin', adminRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
