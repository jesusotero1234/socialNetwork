import React from "react";
import axios from "./axios";

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleChangeTextArea= this.handleChangeTextArea.bind(this)
        this.saveBioDatabase= this.saveBioDatabase.bind(this)
        this.changeToEdit= this.changeToEdit.bind(this)
    }
    componentDidMount() {
        console.log("Profile ComponentDidMount this.props", this.props);
    }
    handleChangeTextArea(e){

        // console.log(e.target)    
        this.setState({
            [e.target.name]:e.target.value
        })


    }

    changeToEdit(){

        this.props.toggleBio(true)
    

    }

    async saveBioDatabase(){

        //First send to the database to save
        // console.log("saveBioDatabase bio status:", this.state.bio)
        const bioInfo={
            bio: this.state.bio
        }
        try {

            const saveBio =await axios.post('/saveBio', bioInfo)
            console.log('saveBioDatabase Response:', saveBio)
        } catch (error) {
            console.log("error in saveBioDatabase", error)
        }

        //Then save in the bio if doesn't occur an error

        this.props.setBio(this.state.bio) 

        this.props.toggleBio(false)

    }
    render() {
        return (
            <div id="user-profile">

                <div className="user-profile">{this.props.profilePic}</div>


                <BioEditor className="user-profile"
                data={this.props.data}
                handleChangeTextArea={this.handleChangeTextArea}
                saveBioDatabase={this.saveBioDatabase}
                bioInState={this.state.bio}
                changeToEdit={this.changeToEdit}
                profileState={this.state}
                />
            </div>
        );
    }
}

function BioEditor(props) {
    const {bio} = props.data;
    // console.log('props from BioEditor ',props)

    // console.log('bio.length',bio.length)
    if( bio.length>0 && props.data.toggle == false){
        return (
            <>
                <p>{props.data.bio}</p>
                <button onClick={props.changeToEdit}>Edit</button>
            </>
        )
    }

    return (
        <>
        <textarea name="bio" id="bio-area-text" cols="30" rows="10" defaultValue={props.data.bio} onChange={props.handleChangeTextArea}></textarea>
        <button onClick={props.saveBioDatabase}>Submit</button>
        </>
        )
}
