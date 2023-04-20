const mit = require('../utils/config');

async function normalizeModel(data) {
    try {
        const normalizeResponse = await mit.normalizeModel(data);
        return normalizeResponse.data;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    normalizeModel
}