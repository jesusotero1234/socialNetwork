const express = require("express");
const app = express();
const compression = require("compression");
const cookieSession = require("cookie-session");
const csurf = require("csurf");
require("custom-env").env();
const {
    userChatInfo,
    insertMessageUser,
    userChatInformation,
    userInfo
} = require("./db");
//Server
const server = require("http").Server(app);
const io = require("socket.io")(server, { origins: "localhost:8080" });

app.use(compression());

app.use(express.static("./public"));

app.use(express.json());

const cookieSessionMiddleware = cookieSession({
    secret: process.env.SECRETS,
    maxAge: 1000 * 60 * 60 * 24 * 90
});

app.use(cookieSessionMiddleware);

io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

//Cookie session before websocket
// app.use(
//     cookieSession({
//         secret: process.env.SECRETS,
//         maxAge: 1000 * 60 * 60 * 24 * 14 //2 Weeks it will last the cookie, when it's over expire
//     })
// );

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

//////////////////////////////////
/////////// Routes //////////////
////////////////////////////////

app.use("/welcome", require("./routes/welcome.js"));

app.use("/login", require("./routes/login.js"));

app.use("/logout", require("./routes/logout.js"));

app.use("/resetPass", require("./routes/resetPass.js"));

app.use("/user", require("./routes/user.js"));

app.use("/saveBio", require("./routes/saveBio.js"));

app.use("/upload", require("./routes/upload.js"));

app.use("/api/users/", require("./routes/otherUsersProfile.js"));

app.use("/lastJoiners", require("./routes/lastJoiners.js"));

app.use("/searchUsers/", require("./routes/searchUsers.js"));

app.use("/friendship/", require("./routes/friendship.js"));

app.use("/friendsRequests", require("./routes/friendsRequests.js"));

////////////////
////////////////
////////////////

//DON'T TOUCH THIS

app.get("*", function(req, res) {
    //If the cookie doesn't exist then redirect otherwise send the index.html(react)
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

server.listen(8080, function() {
    console.log("I'm listening.");
});

//////////////////////////////////
/////////// Socket //////////////
////////////////////////////////

let onlineUsersTable = {};

let usersOnlineArray = [];

let unique = [];

//Server side socket code
io.on("connection", async function(socket) {
    console.log(`socket with the id ${socket.id} is now connected`);
    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }

    const userId = socket.request.session.userId;

    onlineUsersTable[socket.request.session.userId] = {
        userId: socket.request.session.userId,
        created_at: new Date()
    };
    // console.log("check", check(socket.request.session.userId));

    // console.log(onlineUsersTable)

    // console.log("onlineUsers",onlineUsersTable)

    socket.on("disconnect", async function() {
        //When user leave

        //1) Remove from the DB
        // await deleteRequest(userId)
        const userIdDisconnect = {
            userId: Object.values(
                onlineUsersTable[socket.request.session.userId]
            )[0]
        };
        // console.log('disconnect', socket.id)
        io.sockets.emit("disconnectedUser", { userIdDisconnect });
        delete onlineUsersTable[socket.request.session.userId];
        //2) Update state
    });

    // Get the last 10 messages here
    try {
        //Message sent to the database
        const chatStart = await userChatInfo();

        // console.log("chatStart: ", chatStart);

        //send the message to the reducer
        io.sockets.emit("chatMessages", { chatStart });

        //Save online user

        const test = id => {

            let final 
            usersOnlineArray.map(el => {
                
                if (el.id == id) {
                    final= true
                }
            });
            if(final == true){
                return true
            }else{
                return false
            }
        };

        try {
          
            //This option is to check if the user has been connected before
            if (test(userId) == true) {
                io.sockets.emit("onlineUsers", { usersOnlineArray });
                return;
            }

            const usersOnline = await userInfo(socket.request.session.userId);
            // console.log("usersOnline",usersOnline)

            let obj2 = {
                ...usersOnline[0],
                created_at: Object.values(
                    onlineUsersTable[socket.request.session.userId]
                )[1]
            };

            usersOnlineArray.push(obj2);

            io.sockets.emit("onlineUsers", { usersOnlineArray });
   
        } catch (error) {
            console.log(error);
        }
    } catch (error) {
        console.log(error);
    }

    //When the user enter a new message

    socket.on("newMessage", async newMsg => {
        console.log("New msg from chat.js component ", newMsg);
        console.log("userId in newMessage", userId);

        try {
            //DB query to save the message
            const insertMessage = await insertMessageUser(userId, newMsg);
            //DB query to retrive the user information
            const userData = await userChatInformation(userId);
            console.log("insertMessage: ", insertMessage);
            console.log("userData: ", userData);

            const obj = {
                ...userData[0]
            };

            io.sockets.emit("newMessage", obj);
        } catch (error) {
            console.log(error);
        }
    });
});

