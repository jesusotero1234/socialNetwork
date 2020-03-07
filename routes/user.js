const express= require('express');
const router = express.Router()
const {userInfo} = require("../db");
require("custom-env").env();


router.get("/", async function(req, res) {
    try {
        const data = await userInfo(req.session.userId);

        res.json({ data });
    } catch (error) {
        res.sendStatus(500);
    }
});

module.exports = router;