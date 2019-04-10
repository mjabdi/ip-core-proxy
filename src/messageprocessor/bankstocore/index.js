const logger = require('./../../utils/logger')();
const publisher = require('./../../websocket/publisher');

const messageReceivedFromBank = (bank, msg) =>
{
    logger.info(`recovery message received from bank '${bank}': ${msg}`);
    try
    {
        publisher.sendMessage(JSON.parse(msg).bank, JSON.parse(msg).msg);
    }
    catch(err)
    {
        
    }
    //publisher.sendMessage(bank, `message from core to bank : ${msg}`);
}

module.exports = {
    messageReceivedFromBank
}
