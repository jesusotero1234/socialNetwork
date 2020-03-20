const express = require("express");
const router = express.Router();
const { addUserUserInfo } = require("../db");
const { hash } = require("../utils/bCrypts");
require("custom-env").env();
const { sendEmail } = require("../utils/email");
const path = require("path");
const validator = require("email-validator");

console.log(path.join(__dirname, "../index.html"));

router.get("/", (req, res) => {
    console.log("req.session.id: ", req.session);
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(path.join(__dirname, "../index.html"));
    }
});

router.post("/", (req, res) => {
    const { first, lastName, email, password } = req.body;

    if (!validator.validate(email)|| first.trim().length == 0|| lastName.trim().length == 0|| password.trim().length == 0) {
        res.redirect(500, "/welcome");
    }

    //Here we hashed the password and then send the info to the DB
    hash(password).then(hashedpass => {
        addUserUserInfo(first, lastName, email, hashedpass)
            .then(resp => {
                //Take the id of the user and add it to the cookie
                req.session.userId = resp[0].id;
                //Send the response to the front end
                res.json({ resp });

                const { subject, message } = {
                    subject: "Welcome to th Social Network",
                    message:
                        "Thank you for trusting us, please feel free to surf the website and have a lot of fun :P"
                };
                //Send the Welcome Email
                sendEmail(email, subject, message)
                    .then(() => {})
                    .catch(err => console.log("err: ", err));
            })
            .catch(err => {
                //Send an error to the frontend
                res.redirect(500, "/welcome");
                console.log(err);
            });
    });
});

module.exports = router;
