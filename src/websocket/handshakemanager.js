const host = require('./../utils/application').hostname();
const logger = require('./../utils/logger')();
const banks = require('./../utils/banks');
const aesWrapper = require('./../utils/aes-wrapper');
const rsaWrapper = require('./../utils/rsa-wrapper');
const randomstring = require("randomstring");
const db = require('./../startup/db');
const config = require('config');
const publisher = require('./publisher');

module.exports = async (connection ,request ,message ,callback) => {

    if (!connection.Bank)
        {
            const bank = message.utf8Data.trim();

            if (publisher.bankExists(bank))
            {
                connection.sendUTF('failed');
                request.socket.end();
                return;
            }
            connection.sendUTF('ok');
            connection.Bank = bank;
            connection.Authenticated = true;
            callback(connection.Bank,connection);
            logger.info(`bank '${connection.Bank}' connetced.`);
            return;
        }
}


