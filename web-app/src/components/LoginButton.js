import React from 'react';
import GoogleLogin from 'react-google-login';
import '../styles/LoginButton.css';


const LoginButton = (props) => {

  const successGoogle = (response) => {
    console.log(response);
    const user = {
      name: response.profileObj.name,
      image: response.profileObj.imageUrl
    }
    props.loginFunc(true,user);
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
              <button onClick={renderProps.onClick} disabled={renderProps.disabled}></button>
            )}
            buttonText="Login"
            onSuccess={successGoogle}
            onFailure={failureGoogle}
            cookiePolicy={'single_host_origin'}
        />
    </div>
  )
}

export default LoginButton;