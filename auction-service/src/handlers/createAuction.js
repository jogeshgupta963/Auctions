const crypto = require("crypto");
const AWS = require("aws-sdk");
const middy = require("@middy/core");
const httpJsonBodyParser = require("@middy/http-json-body-parser");
const httpEventNormaliser = require("@middy/http-event-normalizer");
const httpErrorHandler = require("@middy/http-error-handler");
const createError = require("http-errors");
const dynamodb = new AWS.DynamoDB.DocumentClient();

const createAuction = async (event) => {
    const { title } = event.body;
    const now = new Date();

    const auction = {
        id: crypto.randomBytes(10).toString("hex"),
        title,
        status: "OPEN",
        createdAt: now.toISOString(),
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
module.exports.handler = middy(createAuction)
    .use(httpErrorHandler())
    .use(httpEventNormaliser())
    .use(httpJsonBodyParser());
