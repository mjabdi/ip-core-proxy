const logger = require('./../../utils/logger')();
const publisher = require('./../../websocket/publisher');

const messageReceivedFromBank = (bank, msg) =>
{
    logger.warn(`message received from bank '${bank}': ${msg}`);
    //publisher.sendMessage(bank, `message from core to bank : ${msg}`);
}

module.exports = {
    messageReceivedFromBank
}
