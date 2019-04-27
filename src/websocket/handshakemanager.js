const logger = require('./../utils/logger')();
const bankConnections = require('./bankconnections');

module.exports = async (connection, message, callback) => {

    if (!connection.Bank)
        {
            const bank = message.utf8Data.trim();

            if (bankConnections.bankExists(bank))
            {
                connection.sendUTF('failed');
                connection.close();
                return;
            }
            connection.sendUTF('ok');
            connection.Bank = bank;
            connection.Authenticated = true;
            callback(connection.Bank, connection);
            logger.info(`bank '${connection.Bank}' connetced.`);
            return;
        }
}


