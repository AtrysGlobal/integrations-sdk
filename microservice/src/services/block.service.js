const mit = require('../utils/config')

async function listBlocks(data) {
    try {
        const blocksResponse = await mit.listBlocks(data);
        return blocksResponse.data;
    } catch (error) {
        console.log('error', error)
        throw new Error(error.message)
    }
}

module.exports = {
    listBlocks
}