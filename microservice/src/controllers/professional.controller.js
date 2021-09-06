const professionalService = require('../services/professional.service');

async function listProfessionals(req, res) {
    try {
        const listResponse = await professionalService.listProfessionals();
        res.send(listResponse);
    } catch (error) {
        res.status(error.errorObject.httpCode);
        res.send(error.errorObject)
    }
}

module.exports = { listProfessionals }