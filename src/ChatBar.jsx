import React, {Component} from 'react';

class ChatBar extends Component {

  getCurrentUser(currentUser) {
    if (currentUser === undefined) {
      return 'Anonymous';
    }
    return currentUser;
  }

  render() {
    return (
     <footer className="chatbar">
        <input className="chatbar-username" placeholder={this.getCurrentUser(this.props.currentUser)} />
        <input className="chatbar-message" placeholder="Type a message and hit ENTER" />
      </footer>
    );
  }

}
export default ChatBar;


