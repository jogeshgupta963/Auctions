const AWS = require("aws-sdk");
const ses = new AWS.SES({ region: "us-east-1" });

module.exports.handler = async (event) => {
    console.log(event);
    const record = event.Records[0];

    const email = JSON.parse(record.body);
    const { subject, body, recipient } = email;

    const params = {
        Source: "jogeshgupta963@gmail.com",
        Destination: {
            ToAddresses: [recipient],
        },
        Message: {
            Body: {
                Text: {
                    Data: body,
                },
            },
            Subject: {
                Data: subject,
            },
        },
    };
    try {
        const res = await ses.sendEmail(params).promise();
        console.log(res);
        return res;
    } catch (err) {
        console.error(err);
    }
};
