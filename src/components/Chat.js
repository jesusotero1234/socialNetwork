import React, { useEffect, useRef } from "react";
import { socket } from "./socket";
import { useSelector } from "react-redux";
import moment from "moment";

export default function Chat() {
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
            //para borrar seria e.target.value = ''
            socket.emit("newMessage", e.target.value);
            e.target.value = "";
        }
    };

    return (
        <div className="chat">
            <h1>Welcome to the general chat</h1>

            <div className="chat-container" ref={elementRef}>
                {chatMessages &&
                    chatMessages.map(el => (
                        <div key={el.id}>
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
            <textarea
                name=""
                id=""
                cols="30"
                rows="10"
                placeholder="Add your message here"
                onKeyDown={keyCheck}
            ></textarea>

            {onlineUsers &&
                onlineUsers.map(el => (
                    <div key={el.id} className="users-online-container">
                        <div className="chat-image-container">
                            <img
                                className="friend-search-img"
                                src={
                                    el.imageurl || "/img/userProfileDefault.png"
                                }
                                alt={el.firstname + el.lastname}
                            />
                            <div className="message-container">
                                <span>
                                    <p>
                                        {el.firstname +
                                            " " +
                                            el.lastname +
                                            " online since" +
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
    );
}
