const professionalService = require('../services/professional.service');

async function listProfessionals(req, res) {
    const listResponse = await professionalService.listProfessionals();
    res.send(listResponse);
}

module.exports = { listProfessionals }