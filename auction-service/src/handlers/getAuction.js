const AWS = require("aws-sdk");
const createError = require("http-errors");
const dynamodb = new AWS.DynamoDB.DocumentClient();
const commonMiddleware = require("../lib/commonMiddleware.js");

module.exports.getAuctionById = async (id) => {
    const auctionId = id;
    let auction;
    try {
        const result = await dynamodb
            .get({
                TableName: process.env.AUCTIONS_TABLE_NAME,
                Key: {
                    id: auctionId,
                },
            })
            .promise();

        auction = result.Item;
    } catch (err) {
        console.log(err);
        throw new createError.InternalServerError(err);
    }
    if (!auction) {
        throw new createError.NotFound(`Auction not found`);
    }
    return auction;
};
const getAuction = async (event) => {
    const auctionId = event.pathParameters.id;
    let auction;
    try {
        const result = await dynamodb
            .get({
                TableName: process.env.AUCTIONS_TABLE_NAME,
                Key: {
                    id: auctionId,
                },
            })
            .promise();

        auction = result.Item;
    } catch (err) {
        throw new createError.InternalServerError(err);
    }
    if (!auction) {
        throw new createError.NotFound(`Auction not found`);
    }
    return {
        statusCode: 200,
        body: JSON.stringify({
            data: auction,
            success: true,
        }),
    };
};
module.exports.handler = commonMiddleware(getAuction);
