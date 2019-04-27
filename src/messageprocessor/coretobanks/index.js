const logger = require('./../../utils/logger')();
const publisher = require('./../../websocket/publisher');
const uuidv4 = require('uuid/v4');
const acks = require('./../../websocket/acks');

const messageReceivedFromCore = (bank, msg, id) =>
{
    logger.info(`new message received from core to bank '${bank}' with ref : ${id}`);
    const ack_id = uuidv4();
    publisher.sendMessage(bank, msg, ack_id);
    var count = 0;
    var timer = setInterval(() => { 
        count++; 
        if (acks.containsAck(bank, ack_id))
        {
            clearInterval(timer); 
        }
        else if (count >= 5) { 
            clearInterval(timer); 
            logger.error(`could not send message to bank ${bank} :msg: ${msg}`);
        } 
        else
        {
            publisher.sendMessage(bank, msg, ack_id);
            logger.warn(`retrying (${count}) send message to bank ${bank} :msg: ${msg}`);
        }
    }, 2000);  
}

module.exports = {
    messageReceivedFromCore
}
