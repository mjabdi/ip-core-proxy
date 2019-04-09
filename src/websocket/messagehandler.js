const logger = require('./../utils/logger')();
const HandshakeManager = require('./handshakemanager');
const registerRealtimeMessageFeed = require('./../startup/db').registerRealtimeMessageFeed;
const processAllNeworPendingMessages = require('./../startup/db').processAllNeworPendingMessages;
const messageReceivedFromCore = require('./../messageprocessor/coretobanks/index').messageReceivedFromCore;
const messageReceivedFromBank = require('./../messageprocessor/bankstocore/index').messageReceivedFromBank;
const publisher = require('./publisher');
const aesWrapper = require('./../utils/aes-wrapper');

const handleMessage = (connection, request) =>
{
    return (message) =>
    {
        if (message.type === 'utf8') {
            if (!connection.Authenticated)
            {
                return HandshakeManager(connection,request,message,initializeConnection);
            }
            else
            {
                messageReceivedFromBank(connection.Bank , aesWrapper.decrypt(connection.Key, connection.Iv ,message.utf8Data));
            }
        }
        else if (message.type === 'binary') {
            connection.sendUTF('Invalid Format : Connection Closed By Server');
            request.socket.end();
        }
    }
}

const initializeConnection = (bank, socketConnection) =>
{
    publisher.addConnection(bank , socketConnection).then( () =>
    {
        processAllNeworPendingMessages(bank, socketConnection, messageReceivedFromCore).then( (result) =>
        {
            registerRealtimeMessageFeed(bank, socketConnection, messageReceivedFromCore);
        }).catch((err) => {
            logger.error(err);
            setTimeout(() => {
                logger.info(`retrying initialize bank '${bank}' connection...`);
                initializeConnection(bank , socketConnection);
            }, 1000);
        });
    });
}

module.exports = {
    handleMessage
}
