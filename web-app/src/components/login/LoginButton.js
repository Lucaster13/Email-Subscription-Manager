import React from 'react';
import GoogleLogin from 'react-google-login';
import '../styles/reset.css';
import '../styles/LoginPage.css';
import LoginLogo from '../images/LoginLogo.svg';
import {session_clr, session_set} from "../../dev/sessionUtils.js";

const OAUTH_SCOPE = "https://www.googleapis.com/auth/gmail.modify";


const LoginButton = (props) => {

  const onSuccess = (response) => {
    console.log("Successful Login");
    // create session object for user
    const googleUser = {
      email: response.profileObj.email,
      name: response.profileObj.name,
      imageUrl: response.profileObj.imageUrl,
      isSignedIn: response.isSignedIn,
      access_token: response.accessToken,
      userId: response.googleId
    }
    session_set("user", googleUser);

    // redirect to profile page
    window.location.href = `/profile/${response.googleId}`;
  }
   
  const onFailure = (err) => {
    console.error("failed to log into google:", err.error);
    session_clr();
  }

  return (
    <div id="LoginButton">
        <GoogleLogin
          clientId="914526913214-1n3c47pbcnl3pfrtuu15ajrkvqr50l1d.apps.googleusercontent.com"
          render={renderProps => (
            <button id="GoogleButton" onClick={renderProps.onClick} disabled={renderProps.disabled}>
              <img src={LoginLogo} alt=""></img>
            </button>
          )}
          scope={OAUTH_SCOPE}
          buttonText="Login"
          onSuccess={onSuccess}
          onFailure={onFailure}
          cookiePolicy={'single_host_origin'}
        />
        <script src="https://apis.google.com/js/platform.js?onload=renderButton" async defer></script>
    </div>
  )
}

export default LoginButton;