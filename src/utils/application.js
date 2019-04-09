const application = {};

const config = require('config');
const log4js = require('log4js');
const host = require('os').hostname();
const logger = require('./logger')();

application.shutdown = () => {
    logger.info('application is shutting down...');

    //**  do anything you need before exiting the application here */
    if (application.httpServer) {
        logger.info('closing the http server...');
        application.httpServer.close(() => {
            logger.info('http server closed.');
        });
    }

    if (application.websocketServer) {
        logger.info('closing the websocket server...');
        application.websocketServer.close(() => {
            logger.info('websocket server closed.');
        });
    }


    setTimeout(() => {
        log4js.shutdown( ()=> {
            process.exit(0);
        });
    }, config.ShutdownTimeout || 3000);
}

application.hostname = () => {
    return host;
}

application.registerForGracefulShutdown = (httpServer, websocketServer) => {
    application.httpServer = httpServer;
    application.websocketServer = websocketServer;

    process.on('SIGTERM', () => {
        if (!application.exitSignalReceived) {
            application.exitSignalReceived = true;
            logger.info('SIGTERM signal received.');
            application.shutdown();
        }
        else {
            console.log('application is shutting down. please wait...');
        }
    });

    process.on('SIGINT', () => {
        if (!application.exitSignalReceived) {
            application.exitSignalReceived = true;
            logger.info('SIGINT signal received.');
            application.shutdown();
        }
        else {
            console.log('application is shutting down. please wait...');
        }
      });
}

application.registerGlobalErrorHandler = () =>
{
    process.on('uncaughtException', (err) => {
        if (!application.exitSignalReceived)
        {
            application.exitSignalReceived = true;
            logger.fatal(`Uncaught Exception occured : ${err.stack}`);
            application.shutdown();
        }
        else
        {
            console.log('application is shutting down. please wait...');
        }
    });

    process.on('unhandledRejection', (err) => {
        if (!application.exitSignalReceived)
        {
            application.exitSignalReceived = true;
            logger.fatal(`Unhandled Promise Rejection occured : ${err}`);
            application.shutdown();
        }
        else
        {
            console.log('application is shutting down. please wait...');
        }
    });
}

module.exports = application;
