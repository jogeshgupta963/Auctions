const AWS = require("aws-sdk");
const commonMiddleware = require("../lib/commonMiddleware.js");
const { getAuctionById } = require("./getAuction.js");
const uploadS3 = require("../lib/uploadS3");
const setAuctionPictureUrl = require("../lib/setAuctionPictureUrl.js");
const uploadAuctionPictureSchema = require("../lib/schemas/uploadAuctionPicture");
const createHttpError = require("http-errors");
const validatorMiddleware = require("@middy/validator");

const uploadAuctionPicture = async (event) => {
    const auctionId = event.pathParameters.id;
    const auction = await getAuctionById(auctionId);
    const base64 = event.body.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64, "base64");
    const { email } = event.requestContext.authorizer.lambda;

    if (auction.seller !== email) {
        throw new createHttpError.Forbidden("You are not seller");
    }

    const result = await uploadS3(auction.id + ".jpg", buffer);

    const newAuc = await setAuctionPictureUrl(auction.id, result.Location);

    return {
        statusCode: 200,
        body: JSON.stringify({ data: newAuc }),
    };
};

module.exports.handler = commonMiddleware(uploadAuctionPicture).use(
    validatorMiddleware({
        eventSchema: transpileSchema(uploadAuctionPictureSchema, {
            useDefaults: true,
            strict: false,
        }),
    })
);
