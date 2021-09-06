const loginService = require('../services/login.service');

async function login(req, res) {
    try {
        const loginResponse = await loginService.login();
        res.send(loginResponse);
    } catch (error) {
        res.status(error.errorObject.httpCode);
        res.send(error.errorObject)
    }
};

module.exports = {
    login
}