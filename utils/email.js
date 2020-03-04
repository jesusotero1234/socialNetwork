const aws = require("aws-sdk");
require("custom-env").env();



const ses = new aws.SES({
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET,
    region: "eu-west-1"
});

exports.sendEmail = function(toAddress, subject, message) {
    return ses
        .sendEmail({
            Source: "Costumer Service <suave.tomato@spicedling.email>",
            Destination: {
                ToAddresses: [toAddress]
            },
            Message: {
                Body: {
                    Text: {
                        Data: message
                    }
                },
                Subject: {
                    Data: subject
                }
            }
        })
        .promise()
        .then(() => console.log("it worked!"))
        .catch(err => console.log(err));
};
