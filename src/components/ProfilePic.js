import React from 'react'


export default function({first, last, url, clickHandler}) {
    console.log(first, last, url,)
    return <img id="userProfilePic" src={url} alt={`${first} ${last}`} onClick={clickHandler}/>

}