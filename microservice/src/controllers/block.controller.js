const blockService = require('../services/block.service');

async function listBlocks(req, res) {
    try {
        const blockResponse = await blockService.listBlocks(req.body);
        res.send(blockResponse);
    } catch (error) {
        res.status(error.errorObject.httpCode);
        res.send(error.errorObject)
    }
}

module.exports = { listBlocks }