const specialtyService = require('../services/specialty.service');

async function listSpecialties(req, res) {
    try {
        const listResponse = await specialtyService.listSpecialties(req.query.specialtyId);
        console.log('listResponse',listResponse)
        res.send(listResponse)
    } catch (error) {
        res.status(error.errorObject.httpCode);
        res.send(error.errorObject)
    }
}

module.exports = { listSpecialties }