var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// import prometheus.js
var myMetrics = require('./prometheus');

// import variable
var c = myMetrics.c;
var g = myMetrics.g;
var h = myMetrics.h;
var register = myMetrics.register;


var app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

//add version gauge
g.set({ code: 200, method:"GET", path:'-', version:'v.0.1.0' }, 1);

app.get('/hello', (req, res) => {

  //counter increment
  c.inc({ code: 200, method:'GET', path:'hello', version:'v.0.1.0' });
  var rand = Math.floor(Math.random() * 100) + 1;

  //histogram observe
  h.observe({ code: 200, method:'GET', path:'hello', version:'v.0.0.1' }, rand);
  const { name = 'Anon' } = req.query;
  res.json({ message: `Hello, ${name}!` });
});




app.get('/metrics', async (req, res) => {
  res.setHeader('Content-Type', register.contentType);
  res.send(await register.metrics());
});





module.exports = app;
