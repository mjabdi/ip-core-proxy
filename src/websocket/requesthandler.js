const config = require('config');
const host = require('./../utils/application').hostname();
const logger = require('./../utils/logger')();
const handleMessage = require('./messagehandler').handleMessage;
const publisher = require('./publisher');

const handleRequest = (request) =>
{
    if (!originIsAllowed(request.origin)) {
        // Make sure we only accept requests from an allowed origin
        request.reject();
        //logger.info(`Connection from origin ${request.origin} rejected.`);
        return;
    }
    
    var connection = request.accept();
    //logger.info(`connection accepted from remote_address : ${request.remoteAddress}  with key : ${request.key}`);
    
    connection.on('message', handleMessage(connection,request));

    connection.on('close', (reasonCode, description) => {
        if (connection.Bank)
        {
            logger.info(' bank ' + connection.Bank + ' disconnected.');
            publisher.removeConnection(connection.Bank);
        }
        else
        {
            //logger.info(`remote peer with key '${request.key}' disconnected.`);
        }
    });
}

function originIsAllowed(origin) {
    // put logic here to detect whether the specified origin is allowed.
    return true;
 }


 module.exports = {
    handleRequest
}
