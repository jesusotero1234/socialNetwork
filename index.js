const express = require("express");
const app = express();
const compression = require("compression");
const { addUserUserInfo } = require("./db");
const { hash } = require("./utils/bCrypts");
const cookieSession = require("cookie-session");
const csurf = require('csurf')

app.use(compression());

app.use(express.static("./public"));
app.use(express.json());

app.use(
    cookieSession({
        secret: "secretpass",
        maxAge: 1000 * 60 * 60 * 24 * 14 //2 Weeks it will last the cookie, when it's over expire
    })
);

app.use(
    express.urlencoded({
        extended: false
    })
);

app.use(csurf());

app.use(function(req, res, next){
    res.cookie('mytoken', req.csrfToken());
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


app.get('/welcome',(req,res)=>{
    if (req.session.id) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
})

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
            })
            .catch(err => {
                //Send an error to the frontend
                res.redirect(500, "/welcome");
                console.log(err);
            });
    });
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
