const { MIT } = require('@atrysglobal/mit-sdk/lib')

const publicKey = ``

const mit = new MIT(process.env.setup, publicKey, 'SDK_PATIENT');

module.exports = mit; 