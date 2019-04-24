const WSSModule = {};

const config = require('config');
const logger = require('./../utils/logger')();
const http = require('http');
const WebSocketServer = require('websocket').server;
const handleRequest = require('./requesthandler').handleRequest;

WSSModule.start = () => {
    const wsPort = config.WebsocketPort || 8080;
    const websocketServer = http.createServer((request, response) => {
        logger.info(`Received request for ${request.url}`);
        response.writeHead(404);
        response.end();
    });

    WSSModule.server = websocketServer;

    websocketServer.listen(wsPort, () => {
        logger.info(`WebSocket server is listening on ws://localhost:${wsPort}`);
        console.log(`WebSocket server is listening on ws://localhost:${wsPort}`);
    });

    const wsServer = new WebSocketServer({
        httpServer: websocketServer,
        autoAcceptConnections: false
    });

    WSSModule.wsServer = wsServer;

    wsServer.on('request', handleRequest);
}

WSSModule.close = (callback) => {
    WSSModule.server.close(callback);
    WSSModule.wsServer.closeAllConnections();
}


module.exports = WSSModule;