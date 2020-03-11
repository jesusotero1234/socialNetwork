import React from "react";
import axios from "./axios";
import ProfilePic from "./ProfilePic";
import FriendButton from '../hooks/FriendButton'

export default class OtherProfiles extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    async componentDidMount() {
        // console.log(this.props.match.params.id);

        try {
            const {data} = await axios.get(
                `/api/users/${this.props.match.params.id}`
            );

            console.log("data from componentDidMount in OtherProfiles: ", data);

                try {
                    
                    this.setState({
                        id:data.obj.id,
                        error: data.obj.error
                    })
                    return
                } catch (error) {
                    
                    console.log('entered in else')
    
            this.setState({
                first: data.data[0].firstname || '',
                last: data.data[0].lastname || '',
                bio: data.data[0].bio || 'No bio yet',
                url: data.data[0].imageurl || "/img/userProfileDefault.png",
                id: data.data[0].id,
               
            });
            console.log(this.state)
        
                
                    
                }

        } catch (err) {
            this.setState({
                err
            });
        }
    }
    render() {
        if (!this.state.id) {
            return <img src="progressbar.gif" alt="progressbar" />;
        }
        return (
            <div id="users-profile">
           {this.state.error}
               {!this.state.error && 
                <>
                <ProfilePic
                    first={this.state.first}
                    last={this.state.last}
                    url={this.state.url}
                />
                <FriendButton  receiverId={this.state.id}/>
                <p>{this.state.first}  {this.state.last}</p>
                <p>{this.state.bio}</p>
                </>
            }
            </div>
        );
    }
}
