export default async function removeOnlineUser(userId) {
   

    return {
        type: "DISCONNECTED_USER",
        userId
    };
}
