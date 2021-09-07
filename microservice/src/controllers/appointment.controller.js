const appointmentService = require('../services/appointment.service');

async function reserveImmediateAppointment(req, res) {
    try {
        const reserveImmediateResponse = await appointmentService.reserveImmediateAppointment();
        res.status(200);
        res.send(reserveImmediateResponse);
    } catch (error) {
        res.status(error.errorObject.httpCode);
        res.send(error.errorObject)
    }
}

async function consolidateInmediateAppointment(req, res) {
    try {
        const consolidateImmediateResponse = await appointmentService.consolidateInmediateAppointment();
        const magicLink = await appointmentService.getMagicLink();
        res.send({ ...consolidateImmediateResponse, magicLink })
    } catch (error) {
        res.status(error.errorObject.httpCode);
        res.send(error.errorObject)
    }
}

async function reserveSheduledAppointment(req, res) {
    try {
        const reservedSheduledResponse = await appointmentService.reserveSheduledAppointment(req.body);
        res.send(reservedSheduledResponse);
    } catch (error) {
        res.status(error.errorObject.httpCode);
        res.send(error.errorObject)
    }
}

async function consolidateSheduledAppointment(req, res) {
    try {
        const consolidateSheduledResponse = await appointmentService.consolidateSheduledAppointment();
        const magicLink = await appointmentService.getMagicLink();
        res.send({ ...consolidateSheduledResponse, magicLink });
    } catch (error) {
        res.status(error.errorObject.httpCode);
        res.send(error.errorObject)        
    }
}

module.exports = {
    reserveImmediateAppointment,
    consolidateInmediateAppointment,
    reserveSheduledAppointment,
    consolidateSheduledAppointment
}