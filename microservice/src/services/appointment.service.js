const mit = require('../utils/config')

async function reserveImmediateAppointment() {
    try {
        const immediateResponse = await mit.reserveInmediateAppointment()
        return immediateResponse.data;
    } catch (error) {
        throw error;
    }
}

async function consolidateInmediateAppointment() {
    try {
        const consolidateResponse = await mit.consolidateInmediateAppointment([])
        return consolidateResponse.data;
    } catch (error) {
        throw error;
    }
}

async function reserveSheduledAppointment(data) {
    try {
        const reservedSheduledResponse = await mit.reserveSheduledAppointment(data)
        return reservedSheduledResponse.data;
    } catch (error) {
        throw error;
    }
}

async function consolidateSheduledAppointment() {
    try {
        const consolidateResponse = await mit.consolidateSheduledAppointment([])
        return consolidateResponse.data;
    } catch (error) {
        throw error;
    }
}

async function getMagicLink() {
    try {
        const magicLink = mit.magicLink();
        return magicLink;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    reserveImmediateAppointment,
    consolidateInmediateAppointment,
    reserveSheduledAppointment,
    consolidateSheduledAppointment,
    getMagicLink
}