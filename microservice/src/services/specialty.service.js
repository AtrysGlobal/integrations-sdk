const mit = require('../utils/config')

async function listSpecialties(specialtyId) {
    try {
        const specialtiesResponse = await mit.listSpecialties(specialtyId);
        return specialtiesResponse.data;
    } catch (error) {
        console.log('error', error)
        throw new Error(error.message)
    }
}

module.exports = {
    listSpecialties
}