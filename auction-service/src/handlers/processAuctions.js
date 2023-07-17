const { closeAuction } = require("../lib/closeAuction");
const { getEndedAuctions } = require("../lib/getEndedAuctions");
const createError = require("http-errors");

async function processAuctions(event) {
    try {
        const auctionsToClose = await getEndedAuctions();
        const closePromises = auctionsToClose.map((auc) => closeAuction(auc));
        await Promise.all(closePromises);
        return { closed: closePromises.length };
    } catch (err) {
        throw new createError.InternalServerError(err);
    }
}

module.exports.handler = processAuctions;
