import React, {Component} from 'react';

class ProfilePage extends Component {
    //constructor to set state
    constructor(props){
        super(props);
        const stateVars = props.location.state
        this.state = {
            isLoggedIn: stateVars.isLoggedIn,
            name: stateVars.name,
            image: stateVars.image,
        }
    }

    render(){
        return(
            <div className="ProfilePage">
                
            </div>
        )
    }
};

export default ProfilePage;