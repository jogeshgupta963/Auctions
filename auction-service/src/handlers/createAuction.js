const crypto = require("crypto");
const AWS = require("aws-sdk");
const createError = require("http-errors");
const dynamodb = new AWS.DynamoDB.DocumentClient();
const commonMiddleware = require("../lib/commonMiddleware.js");

const createAuction = async (event) => {
    const { title } = event.body;
    const now = new Date();
    const endDate = new Date();
    endDate.setHours(now.getHours() + 1);
    const auction = {
        id: crypto.randomBytes(10).toString("hex"),
        title,
        status: "OPEN",
        createdAt: now.toISOString(),
        endingAt: endDate.toISOString(),
        highestBid: {
            amount: 0,
        },
    };
    try {
        await dynamodb
            .put({
                TableName: process.env.AUCTIONS_TABLE_NAME,
                Item: auction,
            })
            .promise();
    } catch (error) {
        throw new createError.InternalServerError(error);
    }
    return {
        statusCode: 201,
        body: JSON.stringify({
            data: auction,
            success: true,
        }),
    };
};
module.exports.handler = commonMiddleware(createAuction);
