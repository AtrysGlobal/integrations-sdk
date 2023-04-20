const mit = require('../utils/config')

async function getSession() {
    try {
        const session = await mit.session()
        return session;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getSession
}