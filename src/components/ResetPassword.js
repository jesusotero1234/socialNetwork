import React from "react";
import { Link } from "react-router-dom";
import axios from "./axios";

export default class ResetPassword extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentDisplay: 1
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
        console.log(currentDisplay)

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
                    this.setState({
                        currentDisplay: 2
                    })
                })
                .catch(err => {
                    console.log("err: ", err)
                });
        } else if (currentDisplay == 2) {

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
                        "response from Display 1 resetPass: ",
                        response
                    );
                    this.setState({
                        currentDisplay: 3
                    })
                })
                .catch(err => {
                    console.log("err: ", err)
                });


        } else {

        }
    }
    render() {
        return (
            <div>
                <h1>Reset Password</h1>

                {/*First step when the user introduce their email*/}

                {this.state.currentDisplay == 1 && (
                    <div>
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
                    </div>
                )}
                {/*second step when the user enters the code and write the password */}

                {this.state.currentDisplay == 2 && (
                    <div>
                        <p>Please enter the code you have received</p>

                        <input type="text" name="userCode" onChange={this.handleChange}/>

                        <p>Please enter a new password</p>

                        <input type="password" name="password"  onChange={this.handleChange}/>

                        <button  onClick={e => {
                            this.resetPass(e, this.state.currentDisplay);
                        }}>Submit</button>
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
