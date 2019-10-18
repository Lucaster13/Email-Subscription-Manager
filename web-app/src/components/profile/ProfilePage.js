import React, {Component} from 'react';
import store from 'store';
import ProfileHeader from './ProfileHeader';
import ProfileBody from './ProfileBody';
import ProfileFooter from './ProfileFooter';
import '../styles/ProfilePage.css';
import GetAllEmails from '../email/GetAllEmails';
import base64url from "base64url";

class ProfilePage extends Component {
    //constructor to set state
    constructor(props){
        super(props);

        var user = store.get('user');

        if(!user){
            this.props.history.push("/");
        }else{
            this.state = {
                name: store.get("user").name,
                email: store.get("user").email,
                imageUrl: store.get("user").imageUrl,
                isLoggedIn: true,
                accessToken: store.get("user").accessToken,
                emails: null,
                profileBodyContent: <h1 id="ProfileEmailsText">Loading...</h1>
            }
        }
    }

    componentDidMount = () => {
        //get emails from user account and store them in component state
        GetAllEmails(this.state.email, this.state.accessToken).then((emails) => {
            this.setState({
                emails: emails,
                profileBodyContent: <h1 id="ProfileEmailsText">Please Select An Option For Sorting</h1>});
        });
    }
    
    //sort functions
    //pass as prop to profile body -> profile options
    sortBySubscription = () => {
        //wait until emails available
        if(this.state.emails === null){
            console.log("Emails not fully loaded yet");
            return;
        };

        console.log("Sorting by subscription");

        //keep array of emails with subscriptions
        var subscriptionEmails = []
        this.state.emails.forEach((email, index) => {
            console.log(email);
            //get payload for subsequent info parsing
            let payload = typeof email.payload !== 'undefined' ? email.payload : null;
            if(payload === null) return;

            //get body of email
            let body = payload.body.size !== 0 ? payload.body.data : payload.parts[0].body.data;

            //get subject of email
            let subject = payload.headers.find((header) => {
                if(header.name === "Subject"){
                    return header.value;
                }else{
                    return null;
                }
            });

            //get sender of email
            let from = payload.headers.find((header) => {
                if(header.name === "From"){
                    return header.value;
                }else{
                    return null;
                }
            });

            //get raw text from body
            let rawText = "";
            if(typeof body !== 'undefined'){
                rawText = base64url.decode(body);
                if(rawText.toLowerCase().includes("unsubscribe")){
                    let newSubEmail = {
                        text: rawText,
                        from: from,
                        subject: subject
                    };
                    subscriptionEmails.push(newSubEmail);
                }
            }
        })

        console.log(subscriptionEmails);
    };

    render(){
        return(
            <div id="ProfilePage">
                <ProfileHeader/>
                <ProfileBody content={this.state.profileBodyContent} sortBySubscription={this.sortBySubscription}/>
                <ProfileFooter/>
            </div>
        )
    }
};

export default ProfilePage;