const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient();
const sqs = new AWS.SQS();
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

    await dynamodb.update(params).promise();
    const {
        title,
        seller,
        highestBid: { amount, bidder },
    } = auction;

    if (amount === 0) {
        await sqs
            .sendMessage({
                QueueUrl: process.env.MAIL_QUEUE_URL,
                MessageBody: JSON.stringify({
                    subject: "No bids on your auction:(",
                    recipient: seller,
                    body: `No bidsss`,
                }),
            })
            .promise();
        return;
    }

    const notifySeller = sqs
        .sendMessage({
            QueueUrl: process.env.MAIL_QUEUE_URL,
            MessageBody: JSON.stringify({
                subject: "Item sold",
                recipient: seller,
                body: `Your item,${title} has been sold for ${amount} to ${bidder}`,
            }),
        })
        .promise();

    const notifyBidder = sqs
        .sendMessage({
            QueueUrl: process.env.MAIL_QUEUE_URL,
            MessageBody: JSON.stringify({
                subject: "You won the auction",
                recipient: bidder,
                body: `Your own the item,${title}`,
            }),
        })
        .promise();

    return Promise.all([notifySeller, notifyBidder]);
};
