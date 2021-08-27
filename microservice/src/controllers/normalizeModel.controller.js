const normalizeModelService = require('../services/normalizeModel.service');

async function normalizeModel(req, res) {
    try {
        const normalizeModelResponse = await normalizeModelService.normalizeModel(req.body);
        res.send(normalizeModelResponse);
    } catch (error) {
        console.log('error normalizeModelcontroller',error)
        throw new Error(error.message)
    }
}

module.exports = {
    normalizeModel
}