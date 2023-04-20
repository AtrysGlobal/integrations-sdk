const { MIT } = require('@atrysglobal/mit-sdk/lib')

const publicKey = ``
const setup = process.env.setup || 'TEST';
const mit = new MIT(setup, publicKey, 'SDK_PATIENT');

module.exports = mit; 