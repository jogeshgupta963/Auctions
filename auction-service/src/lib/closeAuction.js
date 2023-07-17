const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.closeAuction = async (auction) => {
    const params = {
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Key: { id: auction.id },
        UpdateExpression: "set #status = :status ",
        ExpressionAttributeValues: {
            ":status": "CLOSED",
        },
        ExpressionAttributeNames: {
            "#status": "status",
        },
    };

    const result = await dynamodb.update(params).promise();
    return result;
};
