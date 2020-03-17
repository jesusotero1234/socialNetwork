export default async function onlineUsers(message) {
    console.log(message);

    return {
        type: "ONLINE_USERS",
        message
    };
}
