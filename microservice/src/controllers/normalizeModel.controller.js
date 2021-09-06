const normalizeModelService = require('../services/normalizeModel.service');

async function normalizeModel(req, res) {
    try {
        const normalizeModelResponse = await normalizeModelService.normalizeModel(req.body);
        res.send(normalizeModelResponse);
    } catch (error) {
        res.status(error.errorObject.httpCode);
        res.send(error.errorObject)
    }
}

module.exports = {
    normalizeModel
}