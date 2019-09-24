import React from 'react';
import HomeButton from '../HomeButton';
import Button from '../Button'
import '../styles/ProfilePage.css'

const ProfileHeader = (props) => {
    return (
        <div id="ProfileHeader">
            <HomeButton/>
            <div></div>
            <Button text="Sign In"/>
        </div>  
    );
}

export default ProfileHeader;