const express = require("express");
const app = express();
const compression = require("compression");
const {
    addUserUserInfo,
    logIn,
    insertCodeReset,
    checkCode,
    updatePassword
} = require("./db");
const { hash, compare } = require("./utils/bCrypts");
const cookieSession = require("cookie-session");
const csurf = require("csurf");
require("custom-env").env();
const { sendEmail } = require("./utils/email");
const cryptoRandomString = require("crypto-random-string");

app.use(compression());

app.use(express.static("./public"));
app.use(express.json());

app.use(
    cookieSession({
        secret: process.env.SECRETS,
        maxAge: 1000 * 60 * 60 * 24 * 14 //2 Weeks it will last the cookie, when it's over expire
    })
);

app.use(
    express.urlencoded({
        extended: false
    })
);

app.use(csurf());

app.use(function(req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

app.get("/welcome", (req, res) => {
    if (req.session.id) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.post("/welcome", (req, res) => {
    const { first, lastName, email, password } = req.body;

    //Here we hashed the password and then send the info to the DB
    hash(password).then(hashedpass => {
        addUserUserInfo(first, lastName, email, hashedpass)
            .then(resp => {
                //Take the id of the user and add it to the cookie
                req.session.id = resp[0].id;
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

app.get("/login", (req, res) => {
    if (req.session.id) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.post("/login", (req, res) => {
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
            compare(req.body.password, response[0].password).then(boolean => {
                if (boolean) {
                    req.session.userId = response[0].id;
                    console.log("password is correct");
                    res.json({});
                } else {
                    res.redirect(500, "/login");
                    console.log("password is not the same");
                }
            });
        });
    } else {
        res.redirect(500, "/login");
    }
});

app.post("/resetPass", (req, res) => {
    console.log(req.body);

    //////////////////////////////
    //////Current display = 1/////
    //////////////////////////////

    if (req.body.currentDisplay == 1) {
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

                            res.sendStatus(200);
                            // sendEmail(req.body.email, subject, message)
                            //     .then(() => {
                            //         res.sendStatus(200);
                            //     })
                            //     .catch(err => {
                            //         console.log(
                            //             "err in sendEmail ResetPass: ",
                            //             err
                            //         );
                            //     });
                        })
                        .catch(err =>
                            console.log("err in insertCodeReset: ", err)
                        );
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
        console.log(req.body);
        checkCode().then(response => {
            console.log("response from checkCode: ", response);

            if (response.length > 1) {
                //Check if the code exist in the array
                let check = response.find(
                    element => element.code == req.body.code
                );

                if (check.length > 0) {
                    hash(req.body.password)
                        .then(hashedpass => {
                            updatePassword(hashedpass, req.body.email)
                                .then(() => res.sendStatus(200))
                                .catch(err =>
                                    console.log("err in updatePass: ", err)
                                );
                        })
                        .catch(err => console.log("err in hash: ", err));
                }

                console.log("check", check);
            } else if (response.length == 1) {
                hash(req.body.password)
                    .then(hashedpass => {
                        updatePassword(hashedpass, req.body.email)
                            .then(() => res.sendStatus(200))
                            .catch(err =>
                                console.log("err in updatePass length1: ", err)
                            );
                    })
                    .catch(err => console.log("err in hash length1: ", err));
            } else {
                res.sendStatus(500);
            }
        });
    }
});

//DON'T TOUCH THIS
app.get("*", function(req, res) {
    //If the cookie doesn't exist then redirect otherwise send the index.html(react)
    if (!req.session.id) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.listen(8080, function() {
    console.log("I'm listening.");
});
