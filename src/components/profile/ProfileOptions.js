import React, {Component} from 'react';

class ProfileOptions extends Component {
    constructor(props){
        super(props);
        this.state = {
            sortBySubscription: props.sortBySubscription,
            subscriptionBtnPressed: false
        }
    }

    componentDidUpdate = (prevProps, prevState) => {
        this.handleSubscription(prevState.subscriptionBtnPressed);
    }

    handleSubscription = (prevStateOfBtn) => {
        //exit if state not changed
        if(prevStateOfBtn === this.state.subscriptionBtnPressed) return;

        if(this.state.subscriptionBtnPressed){
            this.changeStyle(true, "SubscriptionBtn");
            console.log("Subscription Clicked");
            this.state.sortBySubscription();
        }else{
            this.changeStyle(false, "SubscriptionBtn");
            console.log("Subscription UnClicked");
        }
    }

    //update functions for grouping buttons
    subscriptionPress = () => {
        this.state.subscriptionBtnPressed ? this.setState({subscriptionBtnPressed: false}) : this.setState({subscriptionBtnPressed: true}); 
    }

    //change style of button to appear clicke
    changeStyle = (clicked, elementId) => {
        if(clicked){
            document.getElementById(elementId).setAttribute("class","OptionBtnPressed");
        }else{
            document.getElementById(elementId).setAttribute("class","OptionBtn");
        }
    }
    
    render(){
        return(
            <div id='ProfileOptions'>
                <button className="OptionBtn" id="SubscriptionBtn" onClick={this.subscriptionPress}>SUBSCRIPTIONS</button>
            </div>
        )
    }
}

export default ProfileOptions;