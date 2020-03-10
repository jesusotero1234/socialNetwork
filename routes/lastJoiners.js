const express = require("express");
const router = express.Router();
const { lastJoiners } = require("../db");

router.get("/", async (req, res) => {
    try {
        const data = await lastJoiners();
        res.json({
            data
        });
    } catch (error) {
        res.json({
            error: "something went wrong"
        });
    }
});

module.exports = router;