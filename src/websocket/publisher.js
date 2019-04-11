const publisher = {};

const SimpleHashTable = require('simple-hashtable');
const logger = require('./../utils/logger')();
const aesWrapper = require('./../utils/aes-wrapper');
const db = require('./../startup/db');

const _socketConnections = new SimpleHashTable();

publisher.sendMessage = (bank, msg, id) =>
{
    const trySend = () =>
    {
        _socketConnections.get(bank).sendUTF(msg);
        logger.info(`msg : '${msg}' sent to bank : '${bank}'`);
    }

    try{
        trySend();
    }
    catch(err)
    {
        setTimeout(() => {
            try
            {
                trySend();
            }catch(err)
            {
                setTimeout(() => 
                {
                    try
                    {
                        trySend();
                    }catch(err)
                    {
                        setTimeout(() => {
                            try
                            {
                                trySend();
                            }catch(err)
                            {
                                logger.error(`unable to send message to bank ${bank} with ref : ${id}: connection to bank does not exist!`);
                            }

                        } , 5000);
                    }
                }, 2000);
            }
        } , 1000);
    }
}

publisher.sendMessageToAll = (msg) =>
{
    _socketConnections.values().forEach( (conn) =>
    {
        //var msg_enc = aesWrapper.encrypt(conn.Key, conn.Iv, msg);
        conn.sendUTF(msg);
    });
    logger.info(`msg : '${msg}' sent to all banks`);
}

publisher.addConnection = (bank ,connection) =>
{
    return new Promise( (resolve, reject) =>
    {
        if (_socketConnections.containsKey(bank))
        {
            reject(new Error(`Bank ${bank} already has a connection!`));
        }
        else
        {
            _socketConnections.put(bank ,connection);
            //  db.incrementConnectionCounter(bank).then( (result) => 
            //  {
            //     resolve();
            //  });
        }
    });
}

publisher.removeConnection = (bank) =>
{
    if (_socketConnections.containsKey(bank))
    {
        _socketConnections.remove(bank);
    }
    
  //  await db.decrementConnectionCounter(bank);
}

publisher.bankExists = (bank) =>
{
    return _socketConnections.containsKey(bank);
}

module.exports = publisher;