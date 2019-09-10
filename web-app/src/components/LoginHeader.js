import React from 'react';
import Icon from './Icon';
import Button from './Button'
import '../styles/LoginHeader.css'

const LoginHeader = (props) => {
    return (
        <div id="LoginHeader">
            <Icon/>
            <div></div>
            <Button text="Sign In"/>
        </div>  
    );
}

export default LoginHeader;