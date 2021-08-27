const mit = require('../utils/config')
async function listProfessionals() {
    try {
        const listResponse = await mit.listProfessionals();
        return listResponse.data;
    } catch (error) {
        console.log('error', error)
        throw new Error(error.message)
    }
}

module.exports = {
    listProfessionals
}