const schema = {
    properties: {
        body: {
            type: "string",
            minLength: 1,
            pattern: "=$",
        },
    },
    required: ["body"],
};

module.exports = schema;
