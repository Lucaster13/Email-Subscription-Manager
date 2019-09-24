import React from 'react';
import {withRouter} from 'react-router-dom';
import './styles/LoginPage.css';
import logo from "./images/GmailLogo.svg";

const HomeButton = (props) => {

    //redirect to home page on click
    const iconClick = () => {
        props.history.push('/');
    }

    return (
        <div id="HomeBtn" onClick={iconClick}>
            <div id="HomeBtnImg"><img src={logo} alt=""></img></div>
            <div id="HomeBtnTxt"><h1 id="HomeBtnTxt">GMail Manager</h1></div>
        </div>
    );
}

export default withRouter(HomeButton);