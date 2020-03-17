import React, { useEffect, useRef } from "react";
import { socket } from "./socket";
import { useSelector } from "react-redux";

export default function Chat() {
    const chatMessages = useSelector(state => state && state.messages);
    const newMessage = useSelector(state => state && state.message);

    console.log("here are my last 10 chat messages ", chatMessages);

    const elementRef = useRef();

    useEffect(() => {
        console.log("chat component");
        console.log("elementRef.current: ", elementRef.current);
        console.log("scroll top", elementRef.current.scrollTop);
        console.log("scroll height", elementRef.current.scrollHeight);
        console.log("clientHeight", elementRef.current.clientHeight);
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
                            <img
                            className="friend-search-img"
                                src={
                                    el.imageurl || "/img/userProfileDefault.png"
                                }
                                alt={el.firstname + el.lastname}
                            />
                            <span>
                                <p>
                                    {el.firstname +
                                        el.lastname +
                                        " " +
                                        el.created_at}
                                </p>
                            </span>

                            <div className="message-container">
                                <p>{el.message}</p>
                            </div>
                        </div>
                    ))}
                <p>chat message</p>
            </div>
            <textarea
                name=""
                id=""
                cols="30"
                rows="10"
                placeholder="Add your message here"
                onKeyDown={keyCheck}
            ></textarea>
        </div>
    );
}
