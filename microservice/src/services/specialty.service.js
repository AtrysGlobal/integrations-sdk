const mit = require('../utils/config')

async function listSpecialties(specialtyId) {
    try {
        const specialtiesResponse = await mit.listSpecialties(specialtyId);
        return specialtiesResponse.data;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    listSpecialties
}