const AWS = require("aws-sdk");
const createError = require("http-errors");
const dynamodb = new AWS.DynamoDB.DocumentClient();
const commonMiddleware = require("../lib/commonMiddleware.js");

const getAuctions = async (event) => {
    let auctions;
    const { status } = event.queryStringParameters;
    try {
        const params = {
            TableName: process.env.AUCTIONS_TABLE_NAME,
            IndexName: "statusAndEndDate",
            KeyConditionExpression: "#status = :status",
            ExpressionAttributeValues: {
                ":status": status,
            },
            ExpressionAttributeNames: {
                "#status": "status",
            },
        };
        const result = await dynamodb.query(params).promise();

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
module.exports.handler = commonMiddleware(getAuctions);
