const logger = require('./../../utils/logger')();
const publisher = require('./../../websocket/publisher');
const db = require('./../../startup/db');

const messageReceivedFromCore = (bank, msg) =>
{
    logger.info(`new message received from core to bank '${bank}' : ${JSON.stringify(msg)}`);

    /** Mark the message as pending */
    db.markMessageAsPending(msg.id,bank).then( (result) =>
    {
        try{
            publisher.sendMessage(bank, msg.payload);

            /** Mark the message as sent */
            db.markMessageAsSent(msg.id,bank).then( (result) =>
            {
    
            }).catch( err => logger.error(`error in messageReceivedFromCore : ${err}`));

        }
        catch(err)
        {
            
        }
            
    }).catch( err => logger.error(`error in messageReceivedFromCore : ${err}`));
}

module.exports = {
    messageReceivedFromCore
}
