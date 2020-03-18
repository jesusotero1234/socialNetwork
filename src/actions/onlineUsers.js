export default async function onlineUsers(message) {
    console.log("message form online users",message);

    return {
        type: "ONLINE_USERS",
        message
    };
}
