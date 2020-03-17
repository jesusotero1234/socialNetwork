

export default async function chatMessages(messages){
    // const { data } = await axios.get("/friendsRequests");
    
//   console.log(messages)

    return {
        type: 'CHAT_MESSAGES',
        messages
    }
}