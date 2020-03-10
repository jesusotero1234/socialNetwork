const express = require("express");
const router = express.Router();
const { searchUsers } = require("../db");

router.get("/:name", async (req, res) => {
    try {
  
        const searchUsersData = await searchUsers(req.params.name);
        // console.log("data from searchUsers", searchUsersData)
        res.json({
            searchUsersData
        });
    } catch (error) {
        res.json({
            error: "something went wrong"
        });
    }
});

module.exports = router;