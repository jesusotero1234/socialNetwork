const express = require("express");
const app = express();
const compression = require("compression");
const {
    addUserUserInfo,
    logIn,
    insertCodeReset,
    checkCode,
    updatePassword,
    userInfo,
    insertImage
} = require("./db");
const { hash, compare } = require("./utils/bCrypts");
const cookieSession = require("cookie-session");
const csurf = require("csurf");
require("custom-env").env();
const { sendEmail } = require("./utils/email");
const cryptoRandomString = require("crypto-random-string");
const s3 = require("./utils/s3");
const { s3Url } = require("./config.json"); //?

//////////////////
////// Multer ///
/////////////////
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

const diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

//////////////
//////////////
/////////////

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
    console.log("req.session.id: ", req.session);
    if (req.session.userId) {
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

app.post("/resetPass", (req, res) => {
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

app.get("/user", async function(req, res) {
    try {
        const data = await userInfo(req.session.userId);

        res.json({ data });
    } catch (error) {
        res.sendStatus(500);
    }
});

/////////////
///Upload////
////////////

app.post("/upload", uploader.single("file"), s3.upload, async (req, res) => {
    const url = s3Url + req.file.filename;
    console.log("before enter");
    try {
        const insert = await insertImage(url,req.session.userId);
        console.log("insert", insert);
        res.json({ imageUrl: url });
    } catch (error) {
        console.log(error)
        res.sendStatus(500);
    }
});

//DON'T TOUCH THIS
app.get("*", function(req, res) {
    //If the cookie doesn't exist then redirect otherwise send the index.html(react)
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.listen(8080, function() {
    console.log("I'm listening.");
});
