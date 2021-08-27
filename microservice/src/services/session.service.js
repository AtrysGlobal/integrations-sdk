const mit = require('../utils/config')

async function getSession() {
    try {
        // return 'hola session'
        const session = await mit.session()
        return session;
    } catch (error) {
        console.log('error', error)
        throw new Error(error.message)
    }
}

module.exports = {
    getSession
}