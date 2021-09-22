//add library prom-client
const client = require('prom-client')

// Create a Registry to register the metrics
const register = new client.Registry();




//define counter
const counter = new client.Counter({
  name: 'my_counter',
  help: 'This is my counter',
  labelNames: ['code', 'method','path', 'version'],
  registers: [],
});

//define histogram
const histogram = new client.Histogram({
	name: 'my_process_time',
	help: 'process time in miliseconds',
	labelNames: ['code', 'method','path', 'version'],
	buckets: [0.1, 3, 13, 30, 100, 500],
});

// define gauge
const gauge = new client.Gauge({
	name: 'version',
	help: 'gauge of version',
	labelNames: ['code', 'method','path', 'version'],
});



// Register metric (histogram, counter and gauge)
register.registerMetric(counter);
register.registerMetric(histogram);
register.registerMetric(gauge);

// export variable
exports.counter = counter;
exports.histogram = histogram;
exports.gauge = gauge;
exports.register = register;