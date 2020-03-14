import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import axios from "./axios";
import ProfilePic from "./ProfilePic";
import Uploader from "./Uploader";
import Profile from "./Profile";
import OtherProfiles from "./OtherProfiles";
import FindUsers from "./FindUsers";
import Friends from "./Friends";
export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            toggle: false,
        };
    }
    componentDidMount() {
        //Mount the data to the user profile

        axios
            .get("/user")
            .then(({ data }) => {
                // console.log("APP mount data from DB", data.data[0]);
                // Set the original state of the user
                this.setState({
                    id: data.data[0].id,
                    email: data.data[0].email,
                    first: data.data[0].firstname,
                    last: data.data[0].lastname,
                    imageUrl:
                        data.data[0].imageurl || "/img/userProfileDefault.png",
                    bio: data.data[0].bio || ""
                });

                // console.log("App ComponentDidMOunt state", this.state);
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
            <BrowserRouter>
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
                            clickHandler={() => {



                                if (!this.state.uploaderVisible) {
                                    this.setState({
                                        uploaderVisible: true
                                    });
                                } else {
                                    this.setState({
                                        uploaderVisible: false
                                    });
                                }
                                // console.log("this.state: ", this.state);
                            }}
                        />
                    </div>

                    {this.state.uploaderVisible && (
                        <Uploader
                            finishedUploading={newUrl => {
                                this.setState({
                                    imageUrl: newUrl
                                });
                            }}
                        />
                    )}

                    {!this.state.uploaderVisible && (
                        <Route
                            exact
                            path="/"
                            render={() => (
                                <Profile
                                    toggleBio={bool => {
                                        this.setState({
                                            toggle: bool
                                        });
                                    }}
                                    data={this.state}
                                    setBio={biodata => {
                                        this.setState(
                                            {
                                                bio: biodata
                                            },
                                            console.log(
                                                "App form Bio",
                                                this.state.bio
                                            )
                                        );
                                    }}
                                    profilePic={
                                        <ProfilePic
                                            first={this.state.first}
                                            last={this.state.last}
                                            url={this.state.imageUrl}
                                        />
                                    }
                                />
                            )}
                        />
                    )}
                    {!this.state.uploaderVisible && (
                        <Route
                            exact
                            path="/friends"
                            render={() => (
                               
                                <Friends />
                            )}
                        />
                    )}

                    {!this.state.uploaderVisible && <Route path="/user/:id" component={OtherProfiles} />}
                    <Route exact path="/users" component={FindUsers}/>
                </div>
            </BrowserRouter>
        );
    }
}

// {!this.state.uploaderVisible && (
//     <Profile
//         toggleBio={bool => {
//             this.setState({
//                 toggle: bool
//             });
//         }}
//         data={this.state}
//         setBio={biodata => {
//             this.setState(
//                 {
//                     bio: biodata
//                 },
//                 console.log("App form Bio", this.state.bio)
//             );
//         }}
//         profilePic={
//             <ProfilePic
//                 first={this.state.first}
//                 last={this.state.last}
//                 url={this.state.imageUrl}
//             />
//         }
//     />
// )}
