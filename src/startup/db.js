const db = {};

const config = require('config');
const logger = require('./../utils/logger')();
const rethinkDB = require('rethinkdb');
const application = require('./../utils/application');
const Message = require('./../models/message');

let _connection;


db.initDB = () => {
    return new Promise( (resolve, reject) => 
    {
        if (_connection) {
            logger.console.warn("Trying to init DB again!");
            resolve();
            return;
        }
        rethinkDB.connect({
            host: config.DBHost,
            port: config.DBPort,
            db: config.DBName
        }, (err, conn) => {
            if (err) {
                reject(new Error(`could not connect to the DB! : ${config.DBHost}:${config.DBPort}`));
            }
            else {
                logger.info(`DB Initialized : connected to ${config.DBHost}:${config.DBPort}:${config.DBName}`);
                console.log(`DB Initialized : connected to ${config.DBHost}:${config.DBPort}:${config.DBName}`);

                rethinkDB.dbCreate(config.DBName).run(conn, (result) => {
                    _connection = conn;
                    conn.on('close', function () {
                        logger.fatal('connection lost to the DB!');
                        application.shutdown();
                    });
                    resolve();
                });
            }
        });
    });
}

db.getConnection = () => {
    return _connection;
}

db.registerRealtimeMessageFeed = (bank, socketConnection, callback) => {
    var table = bank + '_in';

    if (!_connection) {
        logger.fatal('trying to register for changefeed but DB is disconnected!');
        application.shutdown();
        return;
    }

    rethinkDB.db(config.DBName).table(table).changes().run(_connection, function (err, cursor) {
        if (err) throw err;
        socketConnection.Cursor = cursor;
        logger.info(' Bank ' + socketConnection.Bank + ' changefeed subscribed.');
        cursor.each(function (err, row) {
            if (err) throw err;
            if (row.new_val && !row.old_val)
                callback(socketConnection.Bank, row.new_val);
        });
    });
}

db.processAllNeworPendingMessages = (bank, socketConnection, callback) => {
    return new Promise((resolve,reject) =>
    {
        var table = bank + '_in';

        if (!_connection) {
            logger.fatal('trying to get pending messages but DB is disconnected!');
            application.shutdown();
            return;
        }
        rethinkDB.db(config.DBName).table(table).filter(rethinkDB.row('status').eq('sent').not()).run(_connection, function (err, cursor) {
            if (err) reject(err);
            logger.info(`'${bank}' : checking for pending messages...`);
            cursor.each( (err, row) => {
                if (err) reject(err);
                logger.info(`processing pending message : '${JSON.stringify(row)}'`);
                callback(socketConnection.Bank, row);
            });
            logger.info(`'${bank}' : checking for pending messages done.`);
            resolve(true);
        });
    });
}

db.addNewMessageToQueue = (payload, bank) => {
    return new Promise((resolve, reject) => {
        var table = bank + '_in';
        var message = new Message(payload);
        rethinkDB.db(config.DBName).table(table).insert(message).run(_connection,{durability : 'soft'} ,(err, result) => {
            if (err) {
                reject(err);
            }
            else {
                if (!result || result.errors > 0) {
                    reject(result);
                }
                else {
                    resolve({id: result.generated_keys[0]});
                }
            }
        });
    });
}

db.markMessageAsPending = (id, bank) => {
    return new Promise((resolve, reject) => {
        var table = bank + '_in';
        rethinkDB.db(config.DBName).table(table).get(id).update({status: 'pending'}).run(_connection, (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(result.new_val);
            }
        });
    });
}

db.markMessageAsSent = (id, bank) => {
    return new Promise((resolve, reject) => {
        var table = bank + '_in';
        rethinkDB.db(config.DBName).table(table).get(id).update({status: 'sent'}).run(_connection, (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(result.new_val);
            }
        });
    });
}

db.incrementConnectionCounter = (bank) => {
    return new Promise((resolve, reject) => {
        var table = 'connections';
        rethinkDB.db(config.DBName).tableCreate(table).run(_connection, (result) => {
            rethinkDB.db(config.DBName).table(table).insert({id: bank, counter: 1}, {
                conflict: function (id, oldVal, newVal) {
                    return newVal.merge({counter: oldVal('counter').add(1)});
                }
            }).run(_connection, (err, result) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result.new_val);
                }
            });
        });
    });
}

db.decrementConnectionCounter = (bank) => {
    return new Promise((resolve, reject) => {
        var table = 'connections';
        rethinkDB.db(config.DBName).table(table).get(bank).update({counter: rethinkDB.row("counter").sub(1)})
            .run(_connection, (err, result) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result.new_val);
                }
            });
    });
}

db.getConnectionCounter = (bank) => {
    return new Promise((resolve, reject) => {
        var table = 'connections';
        rethinkDB.db(config.DBName).table(table).get(bank)
            .run(_connection, (err, result) => {
                if (err) {
                    resolve(0);
                }
                else {
                    if (!result)
                    {
                        resolve(0);
                    }
                    else
                    {
                        resolve(result.counter);
                    }
                }
            });
    });
}


module.exports = db;



