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
        <input className="chatbar-username" value={this.props.currentUser} onChange= {this.props.newUserName} />
        <input className="chatbar-message" placeholder="Type a message and hit ENTER" onKeyPress = {this.props.newMessage} />
      </footer>
    );
  }

}
export default ChatBar;


