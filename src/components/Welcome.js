import React from "react";
import Registration from "./Registration";
import { HashRouter, Route} from "react-router-dom";
import Login from "./Login";
import ResetPassword from './ResetPassword'

export function Welcome() {
    return (
        <HashRouter>


            <div>
                <h1>Welcome to my first social network</h1>
                <img src="/img/logo/feisbuk.jpg" alt="logo" id="logo" />
               

                <div>
                    <Route exact component={Registration} path="/" />
                    <Route exact component={Login} path="/login" />
                    <Route exact component={ResetPassword} path="/resetPass" />
                </div>
            </div>
        </HashRouter>   
    );
}
