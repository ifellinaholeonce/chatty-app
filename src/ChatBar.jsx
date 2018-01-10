import React, {Component} from 'react';



class ChatBar extends Component {


// getCurrentUser = (currentUser) => {
//   if (currentUser === undefined || currentUser === "") {
//     return 'Anonymous';
//   }
//   return currentUser;
// };

  render() {
    return (
     <footer className="chatbar">
        <input className="chatbar-username"
          style={{color: this.props.currentUser.colour}}
          value={this.props.currentUser.name}
          onChange= {this.props.newUserName}
          onBlur={this.props.notifyNameChange}/>
        <input className="chatbar-message" placeholder="Type a message and hit ENTER" onKeyPress = {this.props.newMessage} />
      </footer>
    );
  }

}
export default ChatBar;


