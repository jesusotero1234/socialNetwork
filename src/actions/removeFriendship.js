import axios from "../components/axios";

export default async function (receiverId,buttonText){
    // const { data } = await axios.get("/friendsRequests");
    
    console.log("receiverId,buttonText",receiverId,buttonText);
    const { data } = await axios.post(`/friendship/sendFriendship`, {
        receiverId,
        buttonText
    });

    console.log(data)

    return {
        type: 'REMOVE_FRIENDSHIP',
        receiverId
    }
}