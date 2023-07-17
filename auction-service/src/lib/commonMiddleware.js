const middy = require("@middy/core");
const httpJsonBodyParser = require("@middy/http-json-body-parser");
const httpEventNormaliser = require("@middy/http-event-normalizer");
const httpErrorHandler = require("@middy/http-error-handler");

function handler(handle) {
    return middy(handle).use([
        httpErrorHandler(),
        httpEventNormaliser(),
        httpJsonBodyParser(),
    ]);
}

module.exports = handler;
