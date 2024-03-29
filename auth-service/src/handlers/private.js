async function private(event, context) {
    return {
        statusCode: 200,
        headers: {
            /* Required for CORS support to work */
            "Access-Control-Allow-Origin": "*",
            /* Required for cookies, authorization headers with HTTPS */
            "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({
            event,
            context,
        }),
    };
}
module.exports.handler = private;
