import React from 'react';
import '../styles/Button.css'

const HeaderButton = ({text}) => {
    return (
        <div className = "Button">
            <h3>{text}</h3>
        </div>
    );
}

export default HeaderButton;
