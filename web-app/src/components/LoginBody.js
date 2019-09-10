import React from 'react';
import LoginButton from './LoginButton';
import '../styles/LoginBody.css'

const LoginBody = (props) => {
    return (
        <div id="LoginBody">
            <div></div>
            <LoginButton loginFunc={props.loginFunc}/>
            <div></div>
        </div>  
    );
}

export default LoginBody;