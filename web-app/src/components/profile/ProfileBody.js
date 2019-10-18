import React from 'react';
import ProfileEmails from './ProfileEmails';
import '../styles/ProfilePage.css'
import ProfileOptions from './ProfileOptions';

const ProfileBody = (props) => {
    return (
        //gets emails array as prop emails
        <div id="ProfileBody">
            <ProfileEmails content={props.content}/>
            <ProfileOptions sortBySubscription={props.sortBySubscription}/>
        </div>  
    )
}

export default ProfileBody;