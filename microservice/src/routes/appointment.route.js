const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointment.controller');

function appointmentRoutes(app) {
    router.post('/immediate/reserve', appointmentController.reserveImmediateAppointment);
    router.post('/immediate/consolidate', appointmentController.consolidateInmediateAppointment);
    router.post('/reserve',appointmentController.reserveSheduledAppointment)
    router.post('/consolidate',appointmentController.consolidateSheduledAppointment)
    app.use('/appointment', router);
}

module.exports = appointmentRoutes;