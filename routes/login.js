const express= require('express');
const router = express.Router()
const {logIn} = require("../db");
const { compare } = require("../utils/bCrypts");
require("custom-env").env();
const path = require('path')



router.get("/", (req, res) => {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(path.join(__dirname,'../index.html'));
    }
});

router.post("/", (req, res) => {
    console.log("req.body: ", req.body);
    if (
        req.body.email.trim().length > 0 &&
        req.body.password.trim().length > 0
    ) {
        console.log(req.body.email);

        logIn(req.body.email).then(response => {
            if (response.length <= 0) {
                res.redirect(500, "/login");
                console.log("email doesnt exist");
            }
            console.log("response: ", response);
            compare(req.body.password.trim(), response[0].password).then(
                boolean => {
                    if (boolean) {
                        req.session.userId = response[0].id;
                        console.log("password is correct");
                        res.json({});
                    } else {
                        res.redirect(500, "/login");
                        console.log("password is not the same");
                    }
                }
            );
        });
    } else {
        res.redirect(500, "/login");
    }
});


module.exports = router;