import React from 'react';
import '../styles/reset.css';
import '../styles/ProfilePage.css';
import { session_get } from '../../dev/sessionUtils';
import { cache_get, cache_set } from '../../dev/cacheUtils';
import { useFetch } from "../../dev/apiUtils.js";
import HomeButton from "../HomeButton.js";
import Button from "../Button.js";
import SubscriptionView from "./SubscriptionView.js";




function ProfilePage (props) {
    // get session user and potentially cached data
    const {userId, access_token} = session_get("user");
    const cacheData = cache_get("data", userId);

    // get subscriptions
    const {data, error, loading} = useFetch(userId, access_token);
    
    if(error) {
        console.log("Error Retrieving Data", error.message);
        console.log("Redirecting to Login Page");
        window.location.href = "/";
    };

    // if data not in cache yet, set it
    if(data) cache_set("data", data, userId);

    return(
        <div id="ProfilePage">
            <ProfileHeader/>
            {cacheData && <ProfileBody data={cacheData}/>}
            {loading && !cacheData && <p>loading</p>}
            <ProfileFooter/>
        </div>
    )
};

const ProfileHeader = (props) => {
    return (
        <div id="ProfileHeader">
            <HomeButton/>
            <div></div>
            <Button text="Sign In"/>
        </div>  
    );
}

const ProfileBody = (props) => {
    return (
        //gets emails array as prop emails
        <div id="ProfileBody">
            <SubscriptionView data={props.data}/>
        </div>  
    )
}

const ProfileFooter = (props) => {
    return(
        <div id="ProfileFooter">
            <div></div>
            <Button text="About"/>
        </div>
    )
}



export default ProfilePage;