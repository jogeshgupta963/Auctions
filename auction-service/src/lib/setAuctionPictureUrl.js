const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.setAuctionPictureUrl = async (id, url) => {
    const params = {
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Key: { id },
        UpdateExpression: "set pictureUrl = :url",
        ExpressionAttributeValues: {
            ":url": url,
        },
        ReturnValues: "ALL_NEW",
    };
    const result = await dynamodb.update(params).promise();
    return result.Attributes;
};
