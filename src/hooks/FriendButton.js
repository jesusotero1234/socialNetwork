import React, { useEffect, useState } from "react";
import axios from "../components/axios";

///////////
/////Styles
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles(theme => ({
    margin: {
        margin: theme.spacing(1)
    },
    extendedIcon: {
        marginRight: theme.spacing(1)
    }
}));
///////////

export default function FriendButton({ receiverId }) {
    const [buttonText, setButtonText] = useState();

    const classes = useStyles();

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
        const { data } = await axios.post(`/friendship/sendFriendship`, {
            receiverId,
            buttonText
        });

        console.log(data);
        setButtonText(data.data);
    };

    //Render nothing at the beginning until the component gets mounted
    if (!buttonText) {
        return null;
    }

    return <Button variant="contained" size="medium" color="primary" className={classes.margin} onClick={clickHandler}>{buttonText}</Button>;
}


