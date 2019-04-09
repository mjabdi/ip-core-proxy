const logger = require('./../utils/logger')();

module.exports =  (err, req, res, next) => 
{
    logger.error(`Fatal Error Occured : ${err}`);
    res.status(500).send('Something failed.');
}