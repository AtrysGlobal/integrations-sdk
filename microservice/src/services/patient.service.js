const mit = require('../utils/config')

async function createPatient(data) {
    try {
        // return 'hola createPatient'
        const newPatientResponse = await mit.createPatient(data)
        return newPatientResponse.data;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createPatient
}