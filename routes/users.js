var express = require('express');
var router = express.Router();

// import prometheus.js
var myMetrics = require('../prometheus');

//import metrics variable
var c = myMetrics.c;
var g = myMetrics.g;
var h = myMetrics.h;



/* GET users listing. */
router.get('/', function(req, res, next) {
  c.inc({ code: 200, method:"GET" ,path:'users', version:'v.0.1.0' });
  var rand = Math.floor(Math.random() * 100) + 1;

  //histogram observe
  h.observe({ code: 200, method:'GET', path:'users', version:'v.0.1.0' }, rand);
  res.send('rini path users');
});

module.exports = router;
