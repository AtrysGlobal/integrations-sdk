const mit = require('../utils/config')

async function reserveImmediateAppointment() {
    try {
        const immediateResponse = await mit.reserveInmediateAppointment()
        return immediateResponse.data;
    } catch (error) {
        console.log('error', error)
        throw new Error(error.message)
    }
}

async function consolidateInmediateAppointment() { 
    try {
        const consolidateResponse = await mit.consolidateInmediateAppointment([])
        return consolidateResponse.data;
    } catch (error) {
        console.log('error', error)
        throw new Error(error.message)
    }
}

async function reserveSheduledAppointment(data) {
    try {
        const reservedSheduledResponse = await mit.reserveSheduledAppointment(data)
        return reservedSheduledResponse.data;
    } catch (error) {
        console.log('error', error)
        throw new Error(error.message)
    }
}

async function consolidateSheduledAppointment() {
    try {
        const consolidateResponse = await mit.consolidateSheduledAppointment([])
        return consolidateResponse.data;
    } catch (error) {
        console.log('error', error)
        throw new Error(error.message)
    }
}

module.exports = {
    reserveImmediateAppointment,
    consolidateInmediateAppointment,
    reserveSheduledAppointment,
    consolidateSheduledAppointment
}