import React, { useState, useEffect } from "react";
import axios from "./axios";

export default function FindUsers() {
    const [newUsers, setnewUsers] = useState();
    const [searchUser, setsearchUser] = useState({ val: "" });
    const [resultsSearch, setresultsSearch] = useState([]);

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
            <div id="lastJoiners">
                <p>Find new Joiners below!</p>

                {newUsers &&
                    newUsers.map(el => (
                        <div className="joiners-container" key={el.id}>
                            <img
                                className="friend-search-img"
                                src={el.imageurl}
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

                <input
                    name="username"
                    type="text"
                    defaultValue={searchUser.val}
                    onChange={({ target }) =>
                        setsearchUser({
                            val: target.value
                        })
                    }
                />
                {resultsSearch &&
                    resultsSearch.map(el => (
                        <div className="joiners-container" key={el.id}>
                            
                                <img
                                    className="friend-search-img"
                                    src={el.imageurl}
                                    alt={el.firstname}
                                />
                       
                            <span><p>
                                {el.firstname} {el.lastname}
                                </p>
                            </span>
                        </div>
                    ))}
            </div>
        </>
    );
}
