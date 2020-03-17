

export default async function newMessage(message){


//   console.log(newObj)

    return {
        type: 'CHAT_MESSAGE',
        message
    }
}