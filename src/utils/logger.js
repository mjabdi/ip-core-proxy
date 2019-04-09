const appName = require('./../../package').name;
const log4js = require('log4js');
const config = require('config');

module.exports = () =>
{
    const logger = log4js.getLogger(appName);

    log4js.configure({
        appenders: {
             'file': { type: 'file', filename: 'logs/info.log' } ,
             'console' : {type : 'console' }
              },
        categories: { default: { appenders: ['file','console'], level: logger.level = config.LogLevel } }
      });

    return logger;
} 