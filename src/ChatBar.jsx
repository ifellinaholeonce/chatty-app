import React, {Component} from 'react';

let getCurrentUser = (currentUser) => {
  if (currentUser === undefined) {
    return 'Anonymous';
  }
  return currentUser;
};


class ChatBar extends Component {


  render() {
    return (
     <footer className="chatbar">
        <input className="chatbar-username" placeholder={getCurrentUser(this.props.currentUser)} />
        <input className="chatbar-message" placeholder="Type a message and hit ENTER" onKeyPress = {this.props.newMessage} />
      </footer>
    );
  }

}
export default ChatBar;


