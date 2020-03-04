import React from "react";
import Registration from "./Registration";



export function Welcome() {
    return (
        <div>

            <h1>Welcome to my first social network</h1>
            <img src='/img/logo/feisbuk.jpg' alt="logo"/>

            <p>Please register below to have access!</p>
            <Registration />
        </div>
    );
}
