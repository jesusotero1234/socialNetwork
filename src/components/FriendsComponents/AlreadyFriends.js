import React from 'react'
import removeFriendship from '../../actions/removeFriendship'
import { useDispatch } from "react-redux";

export default function(props) {

    const dispatch = useDispatch()

    console.log("props from Already friends",props)
    const stateArray = props.initialState

    const filteredArray = stateArray.filter(el=> el.accepted == true)
   
console.log(stateArray, filteredArray)
    return (

        <>
         {filteredArray.map(el=>(
           <div key={el.id}>
            <img
                id="userProfilePic"
                src={el.imageurl|| "/img/userProfileDefault.png"}
                alt={el.firstname + el.lastname}
            />
            <p>{el.firstname + " " + el.lastname}</p>

            <button onClick={()=>{
                console.log(el.id)
                dispatch(removeFriendship(el.id,'Remove friend'))
            }} >Remove friend</button>
            </div>
            ))
         }
        </>
    );
}
