import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleChange = this.handleChange.bind(this);
        this.handleUpload = this.handleUpload.bind(this);
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.files[0]
        });
    }

    handleUpload() {
        //Send an axios request
        console.log("this.sate.file: ", this.state.file, this.state);
        var formData = new FormData();

        formData.append("file", this.state.file);

        axios
            .post("/upload", formData)
            .then((resp)=>{
                console.log("resp from POST /upload", resp);
                
                //send image to the array
                this.props.finishedUploading(resp.data.imageUrl);
                console.log("Array despues de subida");
            })
            .catch(err => {
                console.log(err);
                this.setState({
                    error: "Something went wrong with your upload"
                });
            });
    }
    //Here we will make an axios request to upload an Image and send to the cloud + DB,
    // then we will return the url to update the state
    //we also have to make something to return with an event to make the parent aware that we change the state
    render() {
        return (
            <div>
                <input
                    type="file"
                    onChange={this.handleChange}
                    name="file"
                    accept="image/*"
                    id="file"
                />
                <label htmlFor="file">Choose a file</label>
                <button onClick={this.handleUpload} on>Submit</button>
                {this.state.error && (
                    <p>
                        <b>{this.state.error}</b>
                    </p>
                )}
            </div>
        );
    }
}
