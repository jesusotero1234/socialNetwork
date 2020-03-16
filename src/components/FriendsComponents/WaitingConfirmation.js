import React from "react";
import confirmFriendship from "../../actions/confirmFriendship";
import { useDispatch } from "react-redux";

//Material UI styles
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Avatar from '@material-ui/core/Avatar';

const useStyles = makeStyles(theme => ({
    button: {
        margin: theme.spacing(1)
    }
}));

export default function(props) {
    const dispatch = useDispatch();

    //Material UI
    const classes = useStyles();

    console.log("props from Already friends", props);
    const stateArray = props.initialState;

    const filteredArray = stateArray.filter(el => el.accepted == false);

    console.log(stateArray, filteredArray);
    return (
        <>
        
            {filteredArray.map(el => (
                <div key={el.id} className="users-container">
                    <Avatar
                        id="userProfilePic"
                        src={el.imageurl || "/img/userProfileDefault.png"}
                        alt={el.firstname + el.lastname}
                        onClick={()=>  {
                            location.replace(`/user/${el.id}`)
                        } }
                    />
                    <p>{el.firstname + " " + el.lastname}</p>

                    <Button
                        onClick={() => {
                            dispatch(
                                confirmFriendship(
                                    el.id,
                                    "You have a request from this user"
                                )
                            );
                        }}
                        variant="contained"
                        color="primary"
                        size="small"
                        className={classes.button}
                    >
                        You have a request from this user
                    </Button>
                </div>
            ))}
        </>
    );
}
