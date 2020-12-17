import React, {Component} from 'react';
import LoginButton from "./LoginButton.js";
import Button from "../Button.js";
import HomeButton from "../HomeButton.js";

import '../styles/LoginPage.css';
import '../styles/reset.css';

function LoginPage () {
    return (
        <div id= "LoginPage">
            <LoginHeader/>
            <LoginBody/>
            <LoginFooter/>
        </div>
    )
}

export default LoginPage;

const LoginHeader = (props) => {
    return (
        <div id="LoginHeader">
            <HomeButton/>
            <div></div>
            <Button text="Sign In"/>
        </div>  
    );
}

class LoginBody extends Component{

    componentDidMount(){
        this.genElipses();
    }

    genElipses(){
        var signInText = document.getElementById('SignInText');
        
        setInterval(this.genElipsesHelper, 1000, signInText);
    }

    genElipsesHelper(signInText){
        var idx = signInText.innerHTML.lastIndexOf('.') !== -1 ? signInText.innerHTML.lastIndexOf('.')+1 : 12;

        const replaceAt = (string, index, replace) => {
            return (string.substring(0, index) + replace + string.substring(index+5 + 1));
        };

        if(idx === 15){
            signInText.innerHTML = "Sign In Here&nbsp;&nbsp;&nbsp;";
        }else{
            signInText.innerHTML = replaceAt(signInText.innerHTML, idx, '.');
        }
    }

    

    render(){
        return (
            <div id="LoginBody">
                <div id="SignInText">Sign In Here&nbsp;&nbsp;&nbsp;</div>
                <LoginButton/>
            </div>  
        )
    }
}

const LoginFooter = (props) => {
    return(
        <div id="LoginFooter">
            <div></div>
            <Button text="About"/>
        </div>
    )
}

