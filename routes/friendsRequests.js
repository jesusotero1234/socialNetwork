const express = require("express");
const router = express.Router();
const { friendRequests } = require("../db");

router.get("/", async (req, res) => {
   

    try {
        const data = await friendRequests(req.session.userId);
        console.log(data);

        res.json({
            data
        })

    } catch (error) {
        console.log(error)
        res.json({
            error
        })
    }
});

module.exports = router;
