import React from "react";
import axios from "./axios";
import { Link } from 'react-router-dom';
// import { gsap } from "gsap";

export default class Login extends React.Component {
    constructor() {
        super();
        this.state = {};
        this.handleChange = this.handleChange.bind(this);
        this.login = this.login.bind(this);
    }
    handleChange(e) {
        this.setState(
            {
                [e.target.name]: e.target.value
            }
            // console.log("this.state: ", this.state)
        );
    }
    login(e) {
        e.preventDefault();

        const obj = {
            email: this.state.email,
            password: this.state.password
        };

        axios
            .post("/login", obj)
            .then(() => {
                //Change address to the Welcome Page
                location.replace("/");
            })
            .catch(err => {
                this.setState(
                    {
                        error: true
                    },
                    () => console.log("Error in Login", this.state)
                );

                console.log(err);
            });
    }

    render() {
        return (
            <div className="registration-container">
                <form >
                    <input
                        type="text"
                        onChange={this.handleChange}
                        name="email"
                        placeholder="Email"
                    />
                    <input
                        type="password"
                        onChange={this.handleChange}
                        name="password"
                        placeholder="password"
                    />

                    <button onClick={this.login}>Submit</button>
                </form>
                {this.state.error && (
                    <p >
                        <b>
                            Something bad happened with the Log In please try
                            again
                        </b>
                    </p>
                )}
                <Link  to="/resetPass"> Click here to reset your password</Link>
            </div>
        );
    }
}


// id="error" component={GsapError} error="error"

// function GsapError(props){
//     gsap.from('#error', 1 , {x: 50})   
//     return
// }
