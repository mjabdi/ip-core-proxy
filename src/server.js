
require('events').EventEmitter.defaultMaxListeners = 0;
const websocketServer = require('./websocket/websocketserver');
const checkConfig =  require('./startup/config');
const application = require('./utils/application');
const httpServer = require('./startup/httpserver');

let ready = false;

async function run()
{

  //** Gobal Error Handling */
  application.registerGlobalErrorHandler();
  //** */


  //** checking for required configs */
  checkConfig();
  //** */


  //** initialize HTTP server on port : ${HttpPort} */
  await httpServer.start();
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