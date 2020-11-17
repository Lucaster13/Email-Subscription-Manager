import React from 'react';
import GoogleLogin from 'react-google-login';
import '../styles/LoginPage.css';
import LoginLogo from '../images/LoginLogo.svg';
import {session_clr, session_set} from "../../utils.js";


const LoginButton = (props) => {

  const onSuccess = (response) => {
    console.log("Successful Login");
    // create session object for user
    const googleUser = {
      email: response.profileObj.email,
      name: response.profileObj.name,
      imageUrl: response.profileObj.imageUrl,
      isSignedIn: response.isSignedIn,
      accessToken: response.accessToken
    }
    session_set("user", googleUser);

    // cahnge to profile page
    window.location.href = "/profile";
  }
   
  const onFailure = (response) => {
    console.error(response, "failed to log into google");
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
          scope="https://www.googleapis.com/auth/gmail.modify"
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