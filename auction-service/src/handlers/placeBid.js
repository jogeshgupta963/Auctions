const AWS = require("aws-sdk");
const createError = require("http-errors");
const dynamodb = new AWS.DynamoDB.DocumentClient();
const commonMiddleware = require("../lib/commonMiddleware.js");
const { getAuctionById } = require("./getAuction.js");

const placeBid = async (event) => {
    const auctionId = event.pathParameters.id;
    const { amount } = event.body;

    const auc = await getAuctionById(auctionId);
    if (parseInt(amount) <= parseInt(auc.highestBid.amount)) {
        throw new createError.Forbidden("Bid cannot be lower");
    }

    if (auc.status != "OPEN") {
        throw new createError.Forbidden(`Auction is closed`);
    }
    let auction;

    const params = {
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Key: {
            id: auctionId,
        },
        UpdateExpression: "set highestBid.amount = :amount",
        ExpressionAttributeValues: {
            ":amount": amount,
        },
        ReturnValues: "ALL_NEW",
    };

    try {
        const result = await dynamodb.update(params).promise();

        auction = result.Attributes;
    } catch (err) {
        console.log(err);
        throw new createError[500](err);
        throw new createError.InternalServerError(err);
    }
    return {
        statusCode: 200,
        body: JSON.stringify({
            data: auction,
            success: true,
        }),
    };
};
module.exports.handler = commonMiddleware(placeBid);
