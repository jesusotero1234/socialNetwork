import React from "react";
import { HashRouter } from "react-router-dom";
import axios from "./axios";
import ProfilePic from "./ProfilePic";
import Uploader from "./Uploader";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        //Mount the data to the user profile
        axios
            .get("/user")
            .then(({ data }) => {
                // Set the original state of the user
                this.setState({
                    id: data.data[0].id,
                    email: data.data[0].email,
                    first: data.data[0].firstname,
                    last: data.data[0].lastname,
                    imageUrl:
                        data.data[0].imageUrl || " /img/userProfileDefault.png"
                });
                console.log("response in componentDidMount: ", this.state);
            })
            .catch(err =>
                console.log("err in Component did mount axios: ", err)
            );
    }
    render() {
        if (!this.state.id) {
            return <img src="progressbar.gif" alt="progressbar" />;
        }

        return (
            <HashRouter>
                <link rel="stylesheet" href="/style/style.css" />
                <div>
                    <div id="userHeader">
                        <img
                            src="/img/logo/feisbuk.jpg"
                            alt="defaultPic"
                            id="logoProfile"
                        />
                        <ProfilePic
                            first={this.state.first}
                            last={this.state.last}
                            url={this.state.imageUrl}
                            clickHandler={() =>
                                {
                                this.setState({
                                    uploaderVisible: true
                                })
                                console.log('this.state: ', this.state)}
                            }
                        />
                    </div>
                    {this.state.uploaderVisible && (
                        <Uploader
                            finishedUploading={newUrl =>{
                                console.log('this',this)
                                this.setState({
                                    imageUrl: newUrl
                                })
                            }
                            }
                        />

                    )}
                </div>
            </HashRouter>
        );
    }
}
