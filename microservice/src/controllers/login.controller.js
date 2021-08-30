const loginService = require('../services/login.service');

async function login(req, res) {
    const loginResponse = await loginService.login();
    res.send(loginResponse);
};

module.exports = {
    login
}