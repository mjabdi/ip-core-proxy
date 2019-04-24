const logger = require('./../../utils/logger')();
const publisher = require('./../../websocket/publisher');
const acks = require('./../../websocket/acks');

const messageReceivedFromBank = (bank, msg) =>
{
    var message = JSON.parse(msg);

    if (message.type === 'recovery')
    {
        logger.warn(`recovery message received from bank '${bank}': ${message.msg}`);
        try
        {
            publisher.sendMessage(message.bank, message.msg , message.id);
        }
        catch(err)
        {
            
        }
    }
    else if (message.type === 'ack')
    {
        acks.ackReceived(message.bank , message.payload);
    }
    else if (message.type === 'rcvd')
    {
        publisher.sendMessageToAll(msg);
    }

    //publisher.sendMessage(bank, `message from core to bank : ${msg}`);
}

module.exports = {
    messageReceivedFromBank
}
