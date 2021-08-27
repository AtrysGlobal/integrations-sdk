const mit = require('../utils/config')

async function createPatient(data) {
    try {
        // return 'hola createPatient'
        const newPatientResponse = await mit.createPatient(data)
        return newPatientResponse.data;
    } catch (error) {
        console.log('error patientService', error)
        throw new Error(error.message)
    }
}

module.exports = {
    createPatient
}