const appointmentService = require('../services/appointment.service');

async function reserveImmediateAppointment(req, res) {
    const reserveImmediateResponse = await appointmentService.reserveImmediateAppointment();
    res.send(reserveImmediateResponse)
}

async function consolidateInmediateAppointment(req, res) {
    const consolidateImmediateResponse = await appointmentService.consolidateInmediateAppointment();
    res.send(consolidateImmediateResponse)
}

async function reserveSheduledAppointment(req, res) {
    const reservedSheduledResponse = await appointmentService.reserveSheduledAppointment(req.body);
    res.send(reservedSheduledResponse)
}

async function consolidateSheduledAppointment(req, res) {
    const consolidateSheduledResponse = await appointmentService.consolidateSheduledAppointment();
    res.send(consolidateSheduledResponse)
}

module.exports = {
    reserveImmediateAppointment,
    consolidateInmediateAppointment,
    reserveSheduledAppointment,
    consolidateSheduledAppointment
}