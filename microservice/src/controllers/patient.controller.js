const patientService = require('../services/patient.service');

async function createPatient(req, res) {
    const createPatientResponse = await patientService.createPatient(req.body);
    res.send(createPatientResponse);
}

module.exports = {
    createPatient
}

