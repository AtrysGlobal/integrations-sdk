const mit = require('../utils/config')
async function listProfessionals() {
    try {
        const listResponse = await mit.listProfessionals();
        return listResponse.data;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    listProfessionals
}