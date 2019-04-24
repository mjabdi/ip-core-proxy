const publisher = {};

const logger = require('./../utils/logger')();
const bankConnections = require('./bankconnections');

publisher.sendMessage = (bank, msg, id) =>
{
    logger.info(`trying to send msg : '${msg}' to bank : '${bank}'`);

    try{
        bankConnections.getBank(bank).sendUTF(JSON.stringify({type:'message' , msg: msg , id: id}));
    }catch(err){}

    // const trySend = () =>
    // {
    //     logger.info(`trying to send msg : '${msg}' to bank : '${bank}'`);

    //     var ack_id;
    //     if (id === 'null')
    //     {
    //         ack_id = uuidv4();
    //     }
    //     else
    //     {
    //         ack_id = id;
    //     }

    //     bankConnections.getBank(bank).sendUTF(JSON.stringify({type:'message' , msg: msg , id: ack_id}));

    //     setTimeout(() => {
    //         if (!acks.containsAck(bank, ack_id))
    //         {
    //             if (bankConnections.bankExists(bank))
    //             {
    //                 try{
    //                     bankConnections.getBank(bank).sendUTF(JSON.stringify({type:'message' , msg: msg , id: ack_id}));
    //                 }catch(err){}
    //             }
    //             else
    //             {
    //                 //do nothing
    //             }
    //         }
    //     }, 2000);

    //     logger.info(`msg : '${msg}' sent to bank : '${bank}'`);
    // }

    // try{
    //     trySend();
    // }
    // catch(err)
    // {
    //     setTimeout(() => {
    //         try
    //         {
    //             trySend();
    //         }catch(err)
    //         {
    //             setTimeout(() => 
    //             {
    //                 try
    //                 {
    //                     trySend();
    //                 }catch(err)
    //                 {
    //                     setTimeout(() => {
    //                         try
    //                         {
    //                             trySend();
    //                         }catch(err)
    //                         {
    //                             logger.error(`unable to send message to bank ${bank} with ref : ${id}: connection to bank does not exist!`);
    //                         }

    //                     } , 5000);
    //                 }
    //             }, 2000);
    //         }
    //     } , 1000);
    // }
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