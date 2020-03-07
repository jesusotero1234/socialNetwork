const express= require('express');
const router = express.Router()
const {insertImage} = require("../db");
require("custom-env").env();
const s3 = require("../utils/s3");
const { s3Url } = require("../config.json"); //?


//////////////////
////// Multer ///
/////////////////
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

const diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, path.join(__dirname ,"../uploads"));
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

//////////////
//////////////
//////////////


router.post("/", uploader.single("file"), s3.upload, async (req, res) => {
    const url = s3Url + req.file.filename;
    console.log("before enter");
    try {
        const insert = await insertImage(url, req.session.userId);
        console.log("insert", insert);
        res.json({ imageUrl: url });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});


module.exports = router;