
require('events').EventEmitter.defaultMaxListeners = 0;
const config = require('config');
const http = require('http');
const express = require('express');
const app = express();
const logger = require('./utils/logger')();
const websocketServer = require('./websocket/websocketserver');
const db =  require('./startup/db');
const checkConfig =  require('./startup/config');
const banks = require('./utils/banks');
const rsaWrapper = require('./utils/rsa-wrapper');
const application = require('./utils/application');

let ready = false;

async function run()
{
  //** Gobal Error Handling */
  application.registerGlobalErrorHandler();
  //** */


  //** checking for required configs */
  checkConfig();
  //** */

  //** initialize Database */
  // await db.initDB();
  //** */

  //** initialize Banks */
  // banks.init();
  //** end of Banks initialization */

  //** load certificates */
  // rsaWrapper.generateServerCert();
  // rsaWrapper.generateBankCerts();
  // rsaWrapper.loadCertificates();
  //** */

  //** initialize HTTP server on port : ${HttpPort} */
  const httpServer = http.createServer(app);
  // app.use(log4js.connectLogger(logger, { level: logger.level }));
  require('./startup/routes')(app);
  const httpPort = config.HttpPort || 3000;
  httpServer.listen(httpPort, function(){
    logger.info(`Http server is listening on http://localhost:${httpPort}`);
    console.log(`Http server is listening on http://localhost:${httpPort}`);
  });
  //** end of HTTP server initialization */


  //** initialaize WebSocket server on port : ${WebsocketPort} */
  websocketServer.start();
  //** end of WebSocket server initialization */


  //** doing all the neccessary things and cleanup procedures before shutdown  */
  application.registerForGracefulShutdown(httpServer,websocketServer);
  //** */

  ready = true;
}

run();

module.exports.ready = () => {return ready};
module.exports.live = () => {return true};