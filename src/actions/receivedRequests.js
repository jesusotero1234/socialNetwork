import axios from "../components/axios";

export default async function (){
    const { data } = await axios.get("/friendsRequests");
    
    // console.log("Data from the first state ReceivedRequest",data.data);

    return {
        type: 'REQUEST_STATE',
        payload: data.data
    }
}