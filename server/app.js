var config = require('./config/config');
var app = require('./server');

app.listen(config.port);
