import React from 'react';
import GoogleLogin from 'react-google-login';
import '../styles/LoginPage.css';
import LoginLogo from '../images/LoginLogo.svg';


const LoginButton = (props) => {

  const successGoogle = (response) => {
    console.log("Successful Login");
    const googleUser = {
      email: response.profileObj.email,
      name: response.profileObj.name,
      imageUrl: response.profileObj.imageUrl,
      isSignedIn: response.isSignedIn,
      accessToken: response.accessToken
    }
    props.loginFunc(true,googleUser);
  }
   
  const failureGoogle = (response) => {
    console.error(response, "failed to log into google");
    props.loginFunc(false);
  }

  return (
    <div id="LoginButton">
        <GoogleLogin
          clientId="914526913214-1loaib3f5tg003b9fjdfkslgv72503ip.apps.googleusercontent.com"
          render={renderProps => (
            <button id="GoogleButton" onClick={renderProps.onClick} disabled={renderProps.disabled}>
              <img src={LoginLogo} alt=""></img>
            </button>
          )}
          scope="https://www.googleapis.com/auth/gmail.modify"
          buttonText="Login"
          onSuccess={successGoogle}
          onFailure={failureGoogle}
          cookiePolicy={'single_host_origin'}
        />
        <script src="https://apis.google.com/js/platform.js?onload=renderButton" async defer></script>
    </div>
  )
}

export default LoginButton;