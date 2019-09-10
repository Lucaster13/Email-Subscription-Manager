import React, {Component} from 'react';
import LoginHeader from './LoginHeader';
import LoginBody from './LoginBody';
import LoginFooter from './LoginFooter'
import '../styles/LoginPage.css';

class LoginPage extends Component {

    state = {
        isLoggedIn: false,
        user: null
    }

    getLoginStatus = (status,user=null) => {
        this.setState({
            isLoggedIn: status,
            user: user
        })
    }

    componentDidUpdate(prevState){
        if(this.state.isLoggedIn !== prevState.isLoggedIn){
            console.log(`Changing login status to: ${this.state.isLoggedIn}`);
            console.log(this.state.user);
            if(this.state.isLoggedIn){
                this.props.history.push({
                    pathname:'/profile',
                    state: {
                        isLoggedIn: true,
                        name: this.state.user.name,
                        image: this.state.user.image
                    }
                })
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
