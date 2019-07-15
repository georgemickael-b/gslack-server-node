// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign
const { port, env } = require('./config/vars');
const logger = require('./config/logger');
const app = require('./config/express');
const mongoose = require('./config/mongoose');
// open mongoose connection
mongoose.connect();

var http = require('http').createServer(app);
var io = require('socket.io')(http);
require('../src/api/socket/socket').intitSocket(io)

http.listen(port, () => logger.info(`server started on port ${port} (${env})`));
// listen to requests
//app.listen(port, () => logger.info(`server started on port ${port} (${env})`));

/**
* Exports express
* @public
*/
module.exports = http;
