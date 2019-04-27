const logger = require('./../utils/logger')();
const HandshakeManager = require('./handshakemanager');
const messageReceivedFromBank = require('./../messageprocessor/bankstocore/index').messageReceivedFromBank;
const bankConnections = require('./bankconnections');
const aesWrapper = require('./../utils/aes-wrapper');

const handleMessage = (connection) =>
{
    return (message) =>
    {
        if (message.type === 'utf8') {
            if (!connection.Authenticated)
            {
                return HandshakeManager(connection, message, initializeConnection);
            }
            else
            {
                // messageReceivedFromBank(connection.Bank , aesWrapper.decrypt(connection.Key, connection.Iv ,message.utf8Data));
                messageReceivedFromBank(connection.Bank , message.utf8Data);
            }
        }
        else if (message.type === 'binary') {
            connection.sendUTF('Invalid Format : Connection Closed By Server');
            connection.drop();
        }
    }
}

const initializeConnection = (bank, socketConnection) =>
{
    bankConnections.addConnection(bank , socketConnection);    
}

module.exports = {
    handleMessage
}
