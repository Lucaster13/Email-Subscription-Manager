import React from 'react';
import '../styles/ProfilePage.css'

const ProfileBody = (props) => {
    return (
        <div id="ProfileBody">
            {props.emails}
        </div>  
    )
}

export default ProfileBody;