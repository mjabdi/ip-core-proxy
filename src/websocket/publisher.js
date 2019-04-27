const publisher = {};

const logger = require('./../utils/logger')();
const bankConnections = require('./bankconnections');

publisher.sendMessage = (bank, msg, id) =>
{
    if (bankConnections.bankConnected(bank))
    {
        logger.info(`trying to send msg : '${msg}' to bank : '${bank}'`);
        bankConnections.getBank(bank).sendUTF(JSON.stringify({type:'message' , msg: msg , id: id}));
    }
}


publisher.sendMessageToAll = (msg) =>
{
    bankConnections.getAll().values().forEach( (conn) =>
    {
        try{
            if (conn.Bank.startsWith('XXXX'))
                conn.sendUTF(msg);
        }catch(err) {}
    });
}

module.exports = publisher;