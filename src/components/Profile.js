import React from "react";
import axios from "./axios";

//Material UI styles
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles(theme => ({
    button: {
      margin: theme.spacing(1),
    },
  }));

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            disable: true,
            bio: this.props.data.bio || '',
            biOnload: this.props.data.bio || ''
        };
        this.handleChangeTextArea= this.handleChangeTextArea.bind(this)
        this.saveBioDatabase= this.saveBioDatabase.bind(this)
        this.changeToEdit= this.changeToEdit.bind(this)
    }
    componentDidMount() {
        console.log("Profile ComponentDidMount this.props", this.props);
    }
    async handleChangeTextArea(e){
        
        // console.log(e.target)    
        this.setState({
            [e.target.name]:e.target.value
        })        

        //This is to disable the button if you haven't update anything
        if(this.state.biOnload.trim()==  e.target.value.trim()){
            console.log('entered to true')
           
            this.setState({
                disable: true
            })
             return
         }else{
               console.log('entered to false')
            this.setState({
                disable: false
            })
             return
         }


    }

    changeToEdit(){

        this.props.toggleBio(true)
    

    }

    async saveBioDatabase(){
        console.log(this.props.data.bio)

        //Check if it's the same bio do nothing 
       
         
        //First send to the database to save

        // console.log("saveBioDatabase bio status:", this.state.bio)
        const bioInfo={
            bio: this.state.bio.trim()
        }
        try {

            const saveBio =await axios.post('/saveBio', bioInfo)
            console.log('saveBioDatabase Response:', saveBio)
        } catch (error) {
            console.log("error in saveBioDatabase", error)
        }

        //Then save in the bio if doesn't occur an error

        this.props.setBio(this.state.bio.trim()) 

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
                {this.state.error || <p><b>{this.state.error}</b></p> }
            </div>
        );
    }
}

 function BioEditor(props) {
    const classes = useStyles();
    const {bio} = props.data;
    console.log('props from BioEditor ',props)

    console.log('bio.length',bio.length)
    if( bio.length>0 && props.data.toggle == false){
        return (
            <>
                <p>{props.data.bio}</p>
                <Button onClick={props.changeToEdit}
                variant="contained"
                color="primary"
                size="medium"
                className={classes.button}
               
                >Edit</Button>
            </>
        )
    }

    return (
        <>
        <TextField 
        name="bio" 
        id="textarea"
        label="Your Bio"
        multiline
        variant="outlined"
        cols="30" 
        rows="10" 
        defaultValue={props.data.bio} 
        onChange={props.handleChangeTextArea}
        />


        <Button onClick={props.saveBioDatabase}
        variant="contained"
        color="primary"
        size="medium"
        disabled={props.profileState.disable}
        className={classes.button}
        startIcon={<SaveIcon />}
        >Submit</Button>
        </>


        )
}
