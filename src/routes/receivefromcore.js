const logger = require('./../utils/logger')();
const messageReceivedFromCore = require('./../messageprocessor/coretobanks').messageReceivedFromCore;

module.exports = async (req, res) => {
 
    validate(req.body).then( () =>
    {
        try
        {
            messageReceivedFromCore(req.body.bank, req.body.payload, req.id);
            res.status(200).send({status : 'ok' , ref : req.id});
        }
        catch(err)
        {
            res.status(500).send('An error occured while processing the request! Please try again.');
        }
    }).catch( (err) =>
    {
        logger.error('Invalid api call : ' + err.msg);
        res.status(400).send({error : err.msg});
    });
}

function validate(body)
{
    return new Promise( (resolve,reject) => 
    {
        if (!body.bank || !(body.bank.length > 3))
        {
            reject({msg : 'bank parameter is missing or it is not valid!'});
        }
        else if (!body.payload)
        {
            reject({msg : 'payload parameter is missing!'});
        }
        else
        {
            resolve();
        }
    });
}

