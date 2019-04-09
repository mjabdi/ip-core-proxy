const rsaWrapper = {};

const path = require('path');
const fs = require('fs');
const NodeRSA = require('node-rsa');
const crypto = require('crypto');
const banks = require('./../utils/banks');
const logger = require('./logger')();
const application = require('./application');

// load keys from file
rsaWrapper.loadCertificates = () => {

    try
    {
        let privateKeyPath = path.resolve(__dirname, '../../keys' , 'server',  'server.private.pem');
        let publicKeyPath = path.resolve(__dirname, '../../keys' , 'server', 'server.public.pem');

        rsaWrapper.serverPub = fs.readFileSync(publicKeyPath);
        rsaWrapper.serverPrivate = fs.readFileSync(privateKeyPath);

        banks.getAllBanks().forEach( (bank) => {
            let bankPublicKeyPath = path.resolve(__dirname, '../../keys' , 'banks', banks.getPublicKeyFilename(bank));
            banks.getBank(bank).cert = fs.readFileSync(bankPublicKeyPath);
        });
    }
    catch(err)
    {
        logger.fatal(`loading certificates failed! : ${err}`);
        application.shutdown();
    }
};

// !!! just for testing and debuging purposes, should not be used in production !!!
rsaWrapper.generateBankCerts = () => {

    logger.info('gerenating banks certificates, please wait...');
    banks.getAllBanks().forEach( (bank) => 
    {
        let key = new NodeRSA();
        key.generateKeyPair(2048, 65537);
        let privateKeyPath = path.resolve(__dirname, '../../keys' , 'banks', bank + '.private.pem');
        let publicKeyPath = path.resolve(__dirname, '../../keys' , 'banks', bank + '.public.pem');
        if (!fs.existsSync(privateKeyPath))
        {
            fs.writeFileSync(privateKeyPath, key.exportKey('pkcs8-private-pem'));       
            logger.info(`private key generated :  ${privateKeyPath}`);
        }
        if (!fs.existsSync(publicKeyPath))
        {
            fs.writeFileSync(publicKeyPath, key.exportKey('pkcs8-public-pem'));
            logger.info(`private key generated :  ${publicKeyPath}`);
        }
    });
    logger.info('banks certificates generated successfully.');
};

// !!! just for testing and debuging purposes, should not be used in production !!!
rsaWrapper.generateServerCert = () => {
    let key = new NodeRSA();
    key.generateKeyPair(2048, 65537);
    let privateKeyPath = path.resolve(__dirname, '../../keys' , 'server' , 'server.private.pem');
    let publicKeyPath = path.resolve(__dirname, '../../keys' , 'server',  'server.public.pem');
    if (!fs.existsSync(privateKeyPath))
    {
        fs.writeFileSync(privateKeyPath, key.exportKey('pkcs8-private-pem'));       
        logger.info(`private key generated :  ${privateKeyPath}`);
    }
    if (!fs.existsSync(publicKeyPath))
    {
        fs.writeFileSync(publicKeyPath, key.exportKey('pkcs8-public-pem'));
        logger.info(`private key generated :  ${publicKeyPath}`);
    }
};

rsaWrapper.encrypt = (publicKey, message) => {
    try
    {
        let enc = crypto.publicEncrypt({
            key: publicKey,
            padding: crypto.RSA_PKCS1_OAEP_PADDING
        }, Buffer.from(message));

        return enc.toString('base64');
    }
    catch(err)
    {
        logger.error(`encryption failed! : ${err}`);
        return 'null';
    }
};

rsaWrapper.decrypt = (privateKey, message) => {
    try
    {
        let enc = crypto.privateDecrypt({
            key: privateKey,
            padding: crypto.RSA_PKCS1_OAEP_PADDING
        }, Buffer.from(message, 'base64'));

        return enc.toString();
    }
    catch(err)
    {
        logger.error(`decryption failed! : ${err}`);
        return 'null';
    }
};

rsaWrapper.createSignature = (privateKey , message) =>
{
    const signer = crypto.createSign('sha256');
    signer.update(message);
    signer.end();

    const signature = signer.sign(privateKey);
    return signature.toString('base64');
}

rsaWrapper.verifySignature = (publicKey , message, signature) =>
{
    try
    {
        const verifier = crypto.createVerify('sha256');
        verifier.update(message);
        verifier.end();
        const verified = verifier.verify(publicKey, Buffer.from(signature, 'base64'));
        return verified;
    }
    catch(err)
    {
        logger.error(`sign verification failed! : ${err}`);
        return false;
    }
}

module.exports = rsaWrapper;