import React from 'react';
import ProfileHeader from './ProfileHeader';
import ProfileBody from './ProfileBody';
import ProfileFooter from './ProfileFooter';
import '../styles/ProfilePage.css';
import { session_get } from '../../utils';
// import { useAsync } from "react-async";

function ProfilePage (props) {
    // check if login is valid, if not send back to login
    if(!session_get("user")) window.location.href = "/";

    // load emails for user
    // const { data, error, isLoading }  = useAsync();

    
    return(
        <div id="ProfilePage">
            <ProfileHeader/>
            <ProfileBody content={this.state.profileBodyContent} sortBySubscription={this.sortBySubscription}/>
            <ProfileFooter/>
        </div>
    )
};

export default ProfilePage;