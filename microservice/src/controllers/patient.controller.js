const patientService = require('../services/patient.service');

async function createPatient(req, res) {
    try {
        const createPatientResponse = await patientService.createPatient(req.body);
        res.send(createPatientResponse);
    } catch (error) {
        res.status(error.errorObject.httpCode);
        res.send(error.errorObject)
    }
}

module.exports = {
    createPatient
}

