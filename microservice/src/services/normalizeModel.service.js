const mit = require('../utils/config');

async function normalizeModel(data) {
    try {
        const normalizeResponse = await mit.normalizeModel(data);
        return normalizeResponse.data;
    } catch (error) {
        console.log('error normalizeModelService', error)
        throw new Error(error.message)
    }
}

module.exports = {
    normalizeModel
}