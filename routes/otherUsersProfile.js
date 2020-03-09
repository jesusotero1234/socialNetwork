const express = require("express");
const router = express.Router();
const { userInfo } = require("../db");

router.get("/:id", async (req, res) => {
    // console.log("req.params from other profiles", req.params.id);
    try {
        const data = await userInfo(req.params.id);
        console.log('data from OtherProfiles', data.length)
        if (data.length == 0) {
            console.log('entered')
            const obj = {
                error: "User does not exist",
                id: req.params.id
            }
            res.json({obj});
        } else {
            res.json({ data });
        }
    } catch (error) {
        console.log("error from OtherProfiles", error);
    }
});

module.exports = router;
