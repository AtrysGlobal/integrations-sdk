const specialtyService = require('../services/specialty.service');

async function listSpecialties(req, res) {
    const listResponse = await specialtyService.listSpecialties(req.query.specialtyId);
    res.send(listResponse)
}

module.exports = { listSpecialties }