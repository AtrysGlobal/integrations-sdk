const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patient.controller');

function patientRoutes(app) {
    router.post('/create', patientController.createPatient);
    app.use('/patient', router);
}

module.exports = patientRoutes;