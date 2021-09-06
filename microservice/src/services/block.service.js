const mit = require('../utils/config')

async function listBlocks(data) {
    try {
        const blocksResponse = await mit.listBlocks(data);
        return blocksResponse.data;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    listBlocks
}