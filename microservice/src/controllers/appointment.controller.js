const appointmentService = require('../services/appointment.service');

async function reserveImmediateAppointment(req, res) {
    const reserveImmediateResponse = await appointmentService.reserveImmediateAppointment();
    res.send(reserveImmediateResponse)
}

async function consolidateInmediateAppointment(req, res) {
    const consolidateImmediateResponse = await appointmentService.consolidateInmediateAppointment();
    const magicLink = await appointmentService.getMagicLink();
    res.send({ ...consolidateImmediateResponse, magicLink })
}

async function reserveSheduledAppointment(req, res) {
    const reservedSheduledResponse = await appointmentService.reserveSheduledAppointment(req.body);
    res.send(reservedSheduledResponse);
}

async function consolidateSheduledAppointment(req, res) {
    const consolidateSheduledResponse = await appointmentService.consolidateSheduledAppointment();
    const magicLink = await appointmentService.getMagicLink();
    res.send({ ...consolidateSheduledResponse, magicLink });
}

module.exports = {
    reserveImmediateAppointment,
    consolidateInmediateAppointment,
    reserveSheduledAppointment,
    consolidateSheduledAppointment
}