const AWS = require("aws-sdk");
const middy = require("@middy/core");
const httpJsonBodyParser = require("@middy/http-json-body-parser");
const httpEventNormaliser = require("@middy/http-event-normalizer");
const httpErrorHandler = require("@middy/http-error-handler");
const createError = require("http-errors");
const dynamodb = new AWS.DynamoDB.DocumentClient();

const getAuctions = async (event) => {
    let auctions;
    try {
        const result = await dynamodb
            .scan({
                TableName: process.env.AUCTIONS_TABLE_NAME,
            })
            .promise();

        auctions = result.Items;
    } catch (err) {
        throw new createError.InternalServerError(err);
    }
    return {
        statusCode: 200,
        body: JSON.stringify({
            data: auctions,
            success: true,
        }),
    };
};
module.exports.handler = middy(getAuctions)
    .use(httpErrorHandler())
    .use(httpEventNormaliser())
    .use(httpJsonBodyParser());
