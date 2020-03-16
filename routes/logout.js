const express = require("express");
const router = express.Router();
require("custom-env").env();
const path = require("path");

router.get("/", (req, res) => {
    
    req.session = null;
    res.sendStatus(200)
});

module.exports = router;
