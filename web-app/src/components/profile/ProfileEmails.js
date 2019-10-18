import React, {Component} from 'react';


class ProfileEmails extends Component {
    constructor(props){
        super(props);
        this.state = {
            content: props.content
        }
    }

    componentDidUpdate = () => {
        if(this.props.content !== this.state.content){
            this.setState({content: this.props.content});
        }
    }

    render(){
        return(
            <div id='ProfileEmails'>
                {this.state.content}
            </div>
        )
    }


}

export default ProfileEmails;