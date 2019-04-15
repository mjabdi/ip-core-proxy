const httpServer = {};

const config = require('config');
const Fastify = require('fastify');
const uuidv4 = require('uuid/v4');
const routes = require('./routes');
const logger = require('./../utils/logger')();
const application = require('./../utils/application');

let server = null;

httpServer.start = async () =>
{

    const createRequestId = () => uuidv4();

    server = Fastify({
        ignoreTrailingSlash: true,
        genReqId: createRequestId,
    });

    //** add routes */

    routes.setupRoutes(server);

    try {
        await server.listen(config.HttpPort,'0.0.0.0');
        httpServer.started = true;
        logger.info(`server listening on localhost:${config.HttpPort}`);
        console.log(`server listening on localhost:${config.HttpPort}`);
      } catch (err) {
        logger.error(err);
        application.shutdown();
      }
}

httpServer.close = (callback) =>
{
    if (server)
    {
        server.close().then(callback);
    }
}

module.exports = httpServer;