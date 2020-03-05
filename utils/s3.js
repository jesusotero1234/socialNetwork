const aws = require('aws-sdk');
const fs = require('fs');
const { s3Url } = require('../config.json'); //?




const s3 = new aws.S3({
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET
});

exports.upload = (req, res, next) => {
    console.log()
    if (!req.file) {
        console.log('no file');
        return res.sendStatus(500);
    }

    const { filename, mimetype, size, path } = req.file;

    const promise = s3
        .putObject({
            Bucket: 'spicedling',
            ACL: 'public-read',
            Key: filename,
            Body: fs.createReadStream(path),
            ContentType: mimetype,
            ContentLength: size
        })
        .promise();

    promise
        .then(() => {
            // it worked!!!
            console.log('The image has been uploaded to Amazon');
            console.log('Amazon Path', s3Url + req.file.filename);
            next();
            //fs.unlink(path,()=>{}) remove from the upload folder
        })
        .catch(err => {
            // uh oh
            console.log('Error un PutObject (S3)', err);
            res.sendStatus(500);
        });
};

//Deleting from AWS
exports.deleteAWS = (req, res, next) => {
    let val = req.body.url.indexOf('ing/'); //?
    let newKey = req.body.url.slice(val + 4);
    console.log('AWS', newKey);
    const params = {
        Bucket: 'spicedling' /* required */,
        Key: newKey /* required */
    };
    const promise = s3
        .deleteObject(params)
        .promise();

    promise
        .then(() => {
            // it worked!!!
            console.log('The image has been deleted from Amazon');
            next();
            //fs.unlink(path,()=>{}) remove from the upload folder
        })
        .catch(err => {
            // uh oh
            console.log('Error un deleteObject (S3)', err);
            res.sendStatus(500);
        });
};
