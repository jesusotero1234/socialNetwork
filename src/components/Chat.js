import React, { useEffect, useRef } from "react";
import { socket } from "./socket";
import { useSelector } from "react-redux";
import moment from "moment";

//Material UI
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import grey from "@material-ui/core/colors/grey";
import Filter from "bad-words";

// console.log(filter.clean("Don't be an ash0le"));

console.log(grey);

const useStyles = makeStyles(theme => ({
    root: {
        "& .MuiTextField-root": {
            margin: theme.spacing(1),
            width: 200
        }
    }
}));

const theme = createMuiTheme({
    palette: {
        primary: grey,
        secondary: {
            main: grey[50]
        }
    }
});

export default function Chat() {
    const classes = useStyles();

    const chatMessages = useSelector(state => state && state.messages);
    const onlineUsers = useSelector(state => state && state.onlineUsers);

    console.log("here are my last 10 chat messages ", chatMessages);

    const elementRef = useRef();

    useEffect(() => {
        elementRef.current.scrollTop =
            elementRef.current.scrollHeight - elementRef.current.clientHeight;
    }, [chatMessages]);

    const keyCheck = e => {
        if (e.key === "Enter") {
            e.preventDefault();
            console.log(e.target.value.trim().length == 0)
            if(e.target.value.trim().length == 0){
                e.target.value = "";
                return
            }
            
            let filter = new Filter();
            let checkedWord = filter.clean(e.target.value)
            console.log(checkedWord)
            socket.emit("newMessage", checkedWord);
            e.target.value = "";
        }
    };

    return (
        <div>
            <h1 id="welcomeChat">Welcome to the general chat</h1>
            <div className="chat">
                <div className="chatMessages-container">
                    <div className="chat-container" ref={elementRef}>
                        {chatMessages &&
                            chatMessages.map(el => (
                                <div key={el.id} id="chat-container">
                                    <div className="chat-image-container">
                                        <img
                                            className="friend-search-img"
                                            src={
                                                el.imageurl ||
                                                "/img/userProfileDefault.png"
                                            }
                                            alt={el.firstname + el.lastname}
                                        />
                                        <div className="message-container">
                                            <span>
                                                <p>
                                                    {el.firstname +
                                                        " " +
                                                        el.lastname +
                                                        " " +
                                                        moment(
                                                            el.created_at
                                                        ).fromNow()}{" "}
                                                    :
                                                </p>
                                            </span>

                                            <p>{el.message}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                    <MuiThemeProvider theme={theme}>
                        <TextField
                            variant="outlined"
                            id="outlined-multiline-static"
                            label="Chat Message"
                            multiline
                            rows="4"
                            name=""
                            cols="30"
                            placeholder="Add your message here"
                            onKeyDown={keyCheck}
                        ></TextField>
                    </MuiThemeProvider>
                </div>

                <div className="online-users-container">
                    <h1>Online Users</h1>

                    {onlineUsers &&
                        onlineUsers.map(el => (
                            <div key={el.id} className="users-online-container">
                                <div className="chat-image-container">
                                    <img
                                        className="friend-search-img"
                                        src={
                                            el.imageurl ||
                                            "/img/userProfileDefault.png"
                                        }
                                        alt={el.firstname + el.lastname}
                                    />
                                    <div className="message-container">
                                        <span>
                                            <p>
                                                {el.firstname +
                                                    " " +
                                                    el.lastname +
                                                    " is online since " +
                                                    moment(
                                                        el.created_at
                                                    ).fromNow()}{" "}
                                            </p>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}
