import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

//Creating styles for the registration
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    root: {
        "& .MuiTextField-root": {
            margin: theme.spacing(1),
            width: 200
        }
    }
}));

//////////////////////////////////////

export default class Registration extends React.Component {
    constructor() {
        super();
        this.state = {};
        this.handleChange = this.handleChange.bind(this);
        this.registerUser = this.registerUser.bind(this);
    }
    componentDidMount() {
        console.log("original state: ", this.state);
    }
    handleChange(e) {
        console.log(e.target.value);
        this.setState(
            {
                [e.target.name]: e.target.value
            },
            () => console.log(this.state)
        );
    }
    registerUser(e) {
        // var classes = useStyles();
        e.preventDefault();
        //Here check the state first
        // console.log("state to register", this.state);

        //This obj is the user information which will be send out to the axios
        const userInfo = {
            first: this.state.first,
            lastName: this.state.lastName,
            email: this.state.email,
            password: this.state.password
        };

        axios
            .post("/welcome", userInfo)
            .then(resp => {
                console.log("resp from POST /welcome", resp);

                //Here we change the address of the browser
                location.replace("/");
            })
            .catch(err => {
                //Renders an error if we receives a bad response form the server

                this.setState(
                    {
                        error: true
                    },
                    () => console.log("Error in registration", this.state)
                );

                console.log(err);
            });
    }
    render() {
        return (
            <div>
                <h1>Register</h1>

                <p>Please register below to have access!</p>

                <form action="">
                    <input
                        type="text"
                        onChange={this.handleChange}
                        name="first"
                        placeholder="first name"
                    />
                    <input
                        type="text"
                        onChange={this.handleChange}
                        name="lastName"
                        placeholder="last name"
                    />
                    <input
                        type="text"
                        onChange={this.handleChange}
                        name="email"
                        placeholder="email"
                    />
                    <input
                        type="password"
                        onChange={this.handleChange}
                        name="password"
                        placeholder="password"
                    />
                    <button onClick={this.registerUser}>Submit</button>
                </form>
                {this.state.error && (
                    <p>
                        <b>Something bad happened please try again</b>
                    </p>
                )}
                <Link to="/login">Click here to Log in!</Link>
            </div>
        );
    }
}
