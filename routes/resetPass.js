const express= require('express');
const router = express.Router();

const {
    logIn,
    insertCodeReset,
    checkCode,
    updatePassword
} = require("../db");
const { hash } = require("../utils/bCrypts");
require("custom-env").env();
const { sendEmail } = require("../utils/email");
const cryptoRandomString = require("crypto-random-string");




router.post("/", (req, res) => {
    if (req.body.currentDisplay == 1) {
        //////////////////////////////
        //////Current display = 1/////
        //////////////////////////////

        //Handling error Display 1
        console.log(req.body);

        if (req.body.email == undefined || req.body.email.trim().length == 0) {
            return res.json({
                error: "Please check your E-mail"
            });
        }

        logIn(req.body.email)
            .then(response => {
                if (response.length > 0) {
                    //Create a user Code
                    let secretCode = cryptoRandomString({
                        length: 6
                    });

                    ///////////////////
                    insertCodeReset(secretCode, req.body.email)
                        .then(response => {
                            console.log(response);

                            const { subject, message } = {
                                subject:
                                    "Reset your Password in Social Network",
                                message: `Your reset code is: ${response[0].code}`
                            };

                            // return res.sendStatus(200);
                            sendEmail(req.body.email, subject, message)
                                .then(() => {
                                    res.sendStatus(200);
                                })
                                .catch(err => {
                                    console.log(
                                        "err in sendEmail ResetPass: ",
                                        err
                                    );
                                    return res.json({
                                        error: "Please check your E-mail"
                                    });
                                });
                        })
                        .catch(err =>
                            console.log("err in insertCodeReset: ", err)
                        );
                } else {
                    return res.json({
                        error: "Please check your E-mail again"
                    });
                }
            })
            .catch(err => console.log("err LogIn: ", err));
    }
    ///////////////
    ///////////////

    //////////////////////////////
    //////Current display = 2/////
    //////////////////////////////

    if (req.body.currentDisplay == 2) {
        //Handling error Display 2
        if (
            req.body.code == undefined ||
            req.body.password == undefined ||
            req.body.password.trim().length == 0 ||
            req.body.code.trim().length == 0
        ) {
            return res.json({
                error: "Please fill all the fields"
            });
        }

        console.log("display2", req.body.email);
        checkCode(req.body.email)
            .then(response => {
                console.log(
                    "response from checkCode: ",
                    response,
                    response.length
                );

                //if the user sent more than one email
                if (response.length > 1) {
                    //Check if the code exist in the array
                    // let check = response.find(
                    //     element => element.code == req.body.code
                    // );

                    let check = [];
                    response.forEach(element => {
                        if (element.code == req.body.code) {
                            check.push({ element });
                        }
                    });
                    console.log("prueba: ", check.length);
                    if (check.length == 0) {
                        return res.json({
                            error: "The code is incorrect"
                        });
                    }

                    if (check.length > 0) {
                        console.log(
                            "entered in check.length > 0",
                            check.length
                        );
                        hash(req.body.password)
                            .then(hashedpass => {
                                console.log("hashedpass", hashedpass);
                                updatePassword(hashedpass, req.body.email)
                                    .then(() => res.sendStatus(200))
                                    .catch(err =>
                                        console.log("err in updatePass: ", err)
                                    );
                            })
                            .catch(err => console.log("err in hash: ", err));
                    }

                    console.log("check.length", check);

                    //if the user sent just one email
                } else if (response.length == 1) {
                    hash(req.body.password)
                        .then(hashedpass => {
                            updatePassword(hashedpass, req.body.email)
                                .then(() => res.sendStatus(200))
                                .catch(err =>
                                    console.log(
                                        "err in updatePass length1: ",
                                        err
                                    )
                                );
                        })
                        .catch(err =>
                            console.log("err in hash length1: ", err)
                        );
                } else {
                    return res.json({
                        error: "The code is incorrect or is expired"
                    });
                }
            })
            .catch(err => console.log("err: ", err));
    }

    /////////////
    ////////////
});


module.exports = router;