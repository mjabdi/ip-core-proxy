const config = require('config');
const logger = require('./../utils/logger')();
const application = require('./../utils/application');

module.exports = () => {

    const requiredConfigs = [
        'IPCoreRestAPI',
        'HttpPort',
        'WebsocketPort',
        'DBHost',
        'DBPort',
        'DBName',
    ];

    let error = false;
    requiredConfigs.forEach((param) => {
        if (!config.get(param)) {
            logger.fatal(`FATAL ERROR: Config: '${param}' is not set.`);
            error = true;
        }
    });

    if (error) {
        application.shutdown();
    }
}