import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "./axios";
import receivedRequests from "../actions/receivedRequests";
import AlreadyFriends from "./FriendsComponents/AlreadyFriends";
import WaitingConfirmation from "./FriendsComponents/WaitingConfirmation";

export default function Friends() {
    const dispatch = useDispatch();

    const initalState = useSelector(state => state.users);

    useEffect(() => {
        (async () => {
            try {
                //dispatch the first status to the Store
                dispatch(receivedRequests());
            } catch (error) {
                console.log(error);
            }

            console.log("state from Friends component", initalState);
        })();
    }, []);

    return (
        <>
            <div id="users-profile">
                <div>
                    <h1>
                        <b>Already friends</b>
                    </h1>
                    {initalState && (
                        <AlreadyFriends initialState={initalState} />
                    )}
                </div>

                <div>
                    <h1>
                        <b>Waiting to be friends</b>
                    </h1>
                    {initalState && (
                        <WaitingConfirmation initialState={initalState} />
                    )}
                </div>
            </div>
        </>
    );
}

