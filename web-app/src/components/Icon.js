import React from 'react';
import {withRouter} from 'react-router-dom';
import '../styles/Icon.css';
import logo from "../images/GmailLogo.svg";

const Icon = (props) => {

    //redirect to home page on click
    const iconClick = () => {
        props.history.push('/');
    }

    return (
        <div className="Icon" onClick={iconClick}>
            <img src={logo} alt=""></img>
        </div>
    );
}

export default withRouter(Icon);