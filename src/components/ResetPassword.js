import React from "react";
import { Link } from "react-router-dom";
import axios from "./axios";

export default class ResetPassword extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentDisplay: 1,
            error: false
        };
        this.resetPass = this.resetPass.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(e) {
        //Set Email in state
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    resetPass(e, currentDisplay) {
        e.preventDefault();
        console.log(currentDisplay ==2, currentDisplay ==1);

        let obj = {};

        if (currentDisplay == 1) {
            obj = {
                currentDisplay: 1,
                email: this.state.email
            };
            axios
                .post("/resetPass", obj)
                .then(response => {
                    console.log(
                        "response from Display 1 resetPass: ",
                        response
                    );

                    if (response.data.error != undefined) {
                        console.log(response.data.error)
                        return this.setState({
                            error: response.data.error
                        });
                    }

                    this.setState({
                        currentDisplay: 2
                    });
                })
                .catch(err => {
                    console.log(err);
                    this.setState({
                        error: "Please check that you wrote correct your email"
                    });
                });
        } else if (currentDisplay == 2) {

            console.log(this.state)
            obj = {
                currentDisplay: 2,
                email: this.state.email,
                code: this.state.userCode,
                password: this.state.password
            };
            axios
                .post("/resetPass", obj)
                .then(response => {
                    console.log(
                        "response from Display 2 resetPass: ",
                        response
                    );

                    if (response.data.error != undefined) {
                        console.log(response.data.error)
                        return this.setState({
                            error: response.data.error
                        });
                    }



                    this.setState({
                        currentDisplay: 3
                    });
                })
                .catch(err => {
                    this.setState({
                        error: "Please check that you wrote correct your E-mail"
                    });
                    console.log("err: ", err);
                });
        }
    }
    render() {
        return (
            <div className="registration-container">
                <h1>Reset Password</h1>

                {/*First step when the user introduce their email*/}

                {this.state.currentDisplay == 1 && (
                    <div className="registration-container">
                        <p>Please enter your email</p>
                        <input
                            type="text"
                            name="email"
                            onChange={this.handleChange}
                        />
                        <button
                            onClick={e => {
                                this.resetPass(e, this.state.currentDisplay);
                            }}
                        >
                            Submit
                        </button>
                        {this.state.error && (
                            <p>
                                <b>{this.state.error}</b>
                            </p>
                        )}
                    </div>
                )}
                {/*second step when the user enters the code and write the password */}

                {this.state.currentDisplay == 2 && (
                    <div className="registration-container">
                        <p>Please enter the code you have received</p>

                        <input
                            type="text"
                            name="userCode"
                            onChange={this.handleChange}
                        />

                        <p>Please enter a new password</p>

                        <input
                            type="password"
                            name="password"
                            onChange={this.handleChange}
                        />

                        <button
                            onClick={e => {
                                this.resetPass(e, this.state.currentDisplay);
                            }}
                        >
                            Submit
                        </button>
                        {this.state.error && (
                            <p>
                                <b>{this.state.error}</b>
                            </p>
                        )}
                    </div>
                )}

                {/*Third step show Success! */}

                {this.state.currentDisplay == 3 && (
                    <div>
                        <p>Sucess!!</p>

                        <p>
                            Now you can <Link to="/login">Login</Link> with your
                            new password! 😎
                        </p>
                    </div>
                )}
            </div>
        );
    }
}
