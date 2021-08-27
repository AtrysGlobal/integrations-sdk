const mit = require('../utils/config')

async function login() {
    try {
        // return 'hola login'
        const login = await mit.login() 
        return login.data;
    } catch (error) {
        console.log('error', error)
        throw new Error(error.message)
    }
}

module.exports = {
    login
}