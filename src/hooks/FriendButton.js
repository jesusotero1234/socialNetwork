import React, { useEffect, useState } from "react";
import axios from "../components/axios";

export default function FriendButton({ receiverId }) {
    const [buttonText, setButtonText] = useState();

    useEffect(() => {
        //chek if they already are friends
        //1) send an axios request to get the status of the friendship of the users
        (async () => {
            console.log("receiverId: ", receiverId);
            const { data } = await axios.get(`/friendship/${receiverId}`);

            console.log(data);
            setButtonText(data.data);
        })();

        //Store in state a property that will keep track of user friendship
    }, []);


    const clickHandler = async () => {
        //Send the request for the friendship


        console.log("receiverId: ", receiverId);
        const { data } = await axios.post(`/friendship/sendFriendship`, {receiverId, buttonText});

        console.log(data);
        setButtonText(data.data);
    };

    //Render nothing at the beginning until the component gets mounted
    if (!buttonText) {
        return null;
    }

    return <button onClick={clickHandler}>{buttonText}</button>;
}
