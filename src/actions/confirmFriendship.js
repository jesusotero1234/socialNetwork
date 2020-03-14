import axios from "../components/axios";

export default async function confirmFriendship(receiverId,buttonText){
    // const { data } = await axios.get("/friendsRequests");
    
    console.log("receiverId,buttonText",receiverId,buttonText);
    const { data } = await axios.post(`/friendship/sendFriendship`, {
        receiverId,
        buttonText
    });

    console.log(data)

    return {
        type: 'CONFIRM_FRIENDSHIP',
        receiverId
    }
}