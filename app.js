var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const client = require('prom-client')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');



// Create a Registry to register the metrics
const register = new client.Registry();



// client.collectDefaultMetrics({
//     app: 'node-application-monitoring-app',
//     prefix: 'node_',
//     timeout: 10000,
//     gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5],
//     register
// });

const c = new client.Counter({
  name: 'my_counter',
  help: 'This is my counter',
  labelNames: ['code', 'path', 'version'],
});

const h = new client.Histogram({
	name: 'my_process_time',
	help: 'process time in miliseconds',
	labelNames: ['code', 'path', 'version'],
});
// Register the histogram
register.registerMetric(c);
register.registerMetric(h);



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



app.get('/hello', (req, res) => {
  c.inc({ code: 200, path:'hello', version:'v001' });
  var rand = Math.floor(Math.random() * 100) + 1;
  h.observe({ code: 200, path:'hello', version:'v.0.0.1' }, rand);
  const { name = 'Anon' } = req.query;
  res.json({ message: `Hello, ${name}!` });
});
app.get('/metrics', async (req, res) => {
  c.inc({ code: 200, path:'metrics', version:'v001' });
  res.setHeader('Content-Type', register.contentType);
  res.send(await register.metrics());
});



// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });



module.exports = app;
