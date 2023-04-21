const mit = require('../utils/config')

async function login() {
    try {
        const login = await mit.login() 
        return login.data;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    login
}