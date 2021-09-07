//add library prom-client
const client = require('prom-client')

// Create a Registry to register the metrics
const register = new client.Registry();




//define counter
const c = new client.Counter({
  name: 'my_counter',
  help: 'This is my counter',
  labelNames: ['code', 'method','path', 'version'],
  registers: [],
});

//define histogram
const h = new client.Histogram({
	name: 'my_process_time',
	help: 'process time in miliseconds',
	labelNames: ['code', 'method','path', 'version'],
});

// define gauge
const g = new client.Gauge({
	name: 'version',
	help: 'gauge of version',
	labelNames: ['code', 'method','path', 'version'],
});



// Register metric (histogram, counter and gauge)
register.registerMetric(c);
register.registerMetric(h);
register.registerMetric(g);

// export variable
exports.c = c;
exports.h = h;
exports.g = g;
exports.register = register;