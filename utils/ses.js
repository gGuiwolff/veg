const aws = require("aws-sdk");

const ses = new aws.SES({
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET,
    region: "eu-west-1",
});

exports.sendEmail = (body, subject) => {
    ses.sendEmail({
        Source: process.env.AWS_SES_ADDRESS,
        Destination: {
            ToAddresses: [process.env.AWS_SES_ADDRESS],
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
    }).promise();
};
