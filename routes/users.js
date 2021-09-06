var express = require('express');
var router = express.Router();
const client = require('prom-client');
// Create a Registry to register the metrics
const register = new client.Registry();

const c = new client.Counter({
  name: 'my_counter3',
  help: 'This is my counter',
  labelNames: ['code', 'path', 'version'],
});
register.registerMetric(c);


/* GET users listing. */
router.get('/', function(req, res, next) {
  c.inc({ code: 200, path:'users', version:'v001' });
  res.send('respond with a resource');
});

module.exports = router;
