const sessionService = require('../services/session.service');

async function getSession(req, res) {
    try {
        const sessionResponse = await sessionService.getSession();
        res.send(sessionResponse);
    } catch (error) {
        res.status(error.errorObject.httpCode);
        res.send(error.errorObject)
    }
};

module.exports = {
    getSession
}