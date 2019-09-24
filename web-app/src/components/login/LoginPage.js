import React, {Component} from 'react';
import store from 'store';
import LoginHeader from './LoginHeader';
import LoginBody from './LoginBody';
import LoginFooter from './LoginFooter'
import '../styles/LoginPage.css';

class LoginPage extends Component {

    state = {
        isLoggedIn: false,
    }

    getLoginStatus = (status,user=null) => {
        this.setState({
            isLoggedIn: status,
        })
        store.set('user', user);
    }

    componentDidUpdate(prevState){
        if(this.state.isLoggedIn !== prevState.isLoggedIn){
            console.log(`Changing login status to: ${this.state.isLoggedIn}`);
            if(this.state.isLoggedIn){
                this.props.history.push("/profile");
            }
        }
    }
    
    render(){
        return (
            <div id= "LoginPage">
                <LoginHeader/>
                <LoginBody loginFunc={this.getLoginStatus}/>
                <LoginFooter/>
            </div>
        )
    }
}

export default LoginPage;
