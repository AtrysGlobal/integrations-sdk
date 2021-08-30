const blockService = require('../services/block.service');

async function listBlocks(req, res) {
    const blockResponse = await blockService.listBlocks(req.body);
    res.send(blockResponse);
}

module.exports = { listBlocks }