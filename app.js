var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var categoryRouter = require('./routes/category');
var adminRouter = require('./routes/admin')
var watchlistRouter = require('./routes/watchlist');
var charginpointRouter= require('./routes/chargingpoint');
var vechicleRouter = require('./routes/vechicle');
var orderRouter = require('./routes/order');
var superAdminRouter = require('./routes/superAdmin');
const createError = require('http-errors');
const mongoose = require('mongoose');
const cors = require('cors')


var app = express();

app.use(cors())



mongoose.connect('mongodb+srv://pavan:Pavan123@cluster0.bcifb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', { useNewUrlParser: true });



mongoose.connect('mongodb+srv://admin:vechicle123@cluster0.z047r.mongodb.net/electric?retryWrites=true&w=majority', { useNewUrlParser: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, '\n connection error:'));
db.once('open', () => {console.log('db connected successfully');});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');





app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/category', categoryRouter);
app.use('/admin', adminRouter);
app.use('/charginpoint', charginpointRouter);
app.use('/vechicle',vechicleRouter);
app.use('/watchlist', watchlistRouter);
app.use('/order', orderRouter);
app.use('/superadmin',superAdminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
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
