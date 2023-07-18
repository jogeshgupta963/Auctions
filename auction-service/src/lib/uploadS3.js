const AWS = require("aws-sdk");
const s3 = new AWS.S3();
module.exports.uploadS3 = async (key, body) => {
    const result = await s3
        .upload({
            Bucket: process.env.AUCTIONS_BUCKET_NAME,
            Key: key,
            Body: body,
            ContentEncoding: "base64",
            ContentType: "image/jpeg",
        })
        .promise();
    return result;
};
