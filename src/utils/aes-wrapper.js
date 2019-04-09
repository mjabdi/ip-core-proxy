const aesWrapper = {};

const crypto = require('crypto');

// get list of supportable encryption algorithms
aesWrapper.getAlgorithmList = () => {
    console.log(crypto.getCiphers());
};

aesWrapper.generateKey = () => {
    return crypto.randomBytes(32);
};

aesWrapper.generateIv = () => {
    return crypto.randomBytes(16);
};

aesWrapper.encrypt = (key, iv, text) => {
    try
    {
        let encrypted = '';
        let cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
        encrypted += cipher.update(Buffer.from(text), 'utf8', 'base64');
        encrypted += cipher.final('base64');

        return encrypted;
    }
    catch(err)
    {
        logger.error(`AES encryption failed! : ${err}`);
        return 'null';
    }
};

aesWrapper.decrypt = (key, iv , text) => {
    try
    {
        let dec = '';
        let cipher = crypto.createDecipheriv('aes-256-cbc', key,  iv);
        dec += cipher.update(Buffer.from(text, 'base64'), 'base64', 'utf8');
        dec += cipher.final('utf8');

        return dec;
    }
    catch(err)
    {
        logger.error(`AES decryption failed! : ${err}`);
        return 'null';
    }
};

module.exports = aesWrapper;
