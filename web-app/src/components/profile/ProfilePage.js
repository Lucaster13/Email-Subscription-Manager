import React, {Component} from 'react';
import store from 'store';
import ProfileHeader from './ProfileHeader';
import ProfileBody from './ProfileBody';
import ProfileFooter from './ProfileFooter';
import '../styles/ProfilePage.css';
import GetAllEmails from './GetAllEmails'


class ProfilePage extends Component {
    //constructor to set state
    constructor(props){
        super(props);

        //get users emails and store them
        let userEmails;
        GetAllEmails(store.get("user").email, store.get("user").accessToken).then((emails) => {
            userEmails = emails;
        });

        this.state = {
            name: store.get("user").name,
            email: store.get("user").email,
            imageUrl: store.get("user").imageUrl,
            isLoggedIn: true,
            accessToken: store.get("user").accessToken,
            emails: userEmails
        }
    }

    render(){
        return(
            <div id="ProfilePage">
                <ProfileHeader/>
                <ProfileBody emails={this.state.userEmails}/>
                <ProfileFooter/>
            </div>
        )
    }
};

export default ProfilePage;