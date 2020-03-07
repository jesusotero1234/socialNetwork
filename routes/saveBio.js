const express= require('express');
const router = express.Router()
const {saveBio} = require("../db");
require("custom-env").env();

router.post("/", async (req, res) => {
    console.log("saveBio post req.body", req.body);

    try {
        const sendBio = await saveBio(req.session.userId, req.body.bio);
        console.log("sendBio", sendBio);
        res.sendStatus(200);
    } catch (error) {
        console.log("error Save Bio: ", error);
        res.sendStatus(500);
    }
});

module.exports = router;