import React, { useState, useEffect } from "react";
import axios from "./axios";

//Material UI
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
// import white from '@material-ui/core/colors/white';

const useStyles = makeStyles(theme => ({    
    root: {
        "& > *": {
            margin: theme.spacing(1),
            width: 200
        }
    }
}));

export default function FindUsers() {
    const [newUsers, setnewUsers] = useState();
    const [searchUser, setsearchUser] = useState({ val: "" });
    const [resultsSearch, setresultsSearch] = useState([]);

    const classes = useStyles();

    useEffect(() => {
        let abort;

        (async () => {
            const { data } = await axios.get("/lastJoiners");

            // console.log("data from last Joiners: ", data);

            setnewUsers(data.data);

            const searchUsersData = await axios.get(
                `/searchUsers/${searchUser.val}`
            );
            console.log(searchUsersData.data.searchUsersData);
            if (!abort) {
                setresultsSearch(searchUsersData.data.searchUsersData);
            }
        })();

        return () => {
            abort = true;
        };
    }, [searchUser]);

    return (
        <>
            <p id="lastJoinersP">The last 3 joiners are </p>
            <div id="lastJoiners">
                {newUsers &&
                    newUsers.map(el => (
                        <div className="joiners-container" key={el.id}>
                            <img
                                className="friend-search-img"
                                src={
                                    el.imageurl || "/img/userProfileDefault.png"
                                }
                                alt={el.firstname + el.lastname}
                            />
                            <span>
                                {el.firstname} {el.lastname}
                            </span>
                        </div>
                    ))}
            </div>

            <div id="searchFriends">
                <p>Here you can search and discover new friends</p>

                <TextField
                    label="Search for User"
                    variant="outlined"
                    id="outlined-basic"
                    name="username"
                    type="text"
                    defaultValue={searchUser.val}
                    onChange={({ target }) =>
                        setsearchUser({
                            val: target.value
                        })
                    }
                />
                <div className="joiners-container2">
                    {resultsSearch &&
                        resultsSearch.map(el => (
                            <div className="joiners-container" key={el.id}>
                                <div>
                                    <img
                                        className="friend-search-img"
                                        src={
                                            el.imageurl ||
                                            "/img/userProfileDefault.png"
                                        }
                                        alt={el.firstname}
                                    />
                                </div>
                                <span>
                                    <p>
                                        {el.firstname} {el.lastname}
                                    </p>
                                </span>
                            </div>
                        ))}
                </div>
            </div>
        </>
    );
}
