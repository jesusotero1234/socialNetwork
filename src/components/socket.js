import * as io from "socket.io-client";
import chatMessages from "../actions/chatMessages";
import newMessage from "../actions/newMessage";
import onlineUsers from "../actions/onlineUsers";
import removeOnlineUser from "../actions/removeOnlineUser";

export let socket;

export const init = store => {
    if (!socket) {
        socket = io.connect();

        socket.on("muffinMagic", mymuffin => {
            console.log("myMuffin on the client side", mymuffin);
        });

        socket.on("chatMessages", msgs => store.dispatch(chatMessages(msgs)));

        socket.on("newMessage", msg => store.dispatch(newMessage(msg)));

        socket.on("onlineUsers", msg => store.dispatch(onlineUsers(msg)));

        socket.on("disconnectedUser", msg => store.dispatch(removeOnlineUser(msg)));
    }
};
