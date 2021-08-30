const sessionService = require('../services/session.service');

async function getSession(req, res) {
    const sessionResponse = await sessionService.getSession();
    res.send(sessionResponse);
};

module.exports = {
    getSession
}