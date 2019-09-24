import React from 'react';
import HomeButton from '../HomeButton';
import Button from '../Button'
import '../styles/LoginPage.css'

const LoginHeader = (props) => {
    return (
        <div id="LoginHeader">
            <HomeButton/>
            <div></div>
            <Button text="Sign In"/>
        </div>  
    );
}

export default LoginHeader;