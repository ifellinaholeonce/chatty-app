import React, {Component} from 'react';
import Message from './Message.jsx';

class MessageList extends Component {


  render() {
    return (
      <main className="messages">
        { this.props.messages.map((msg) => <Message key={msg.id} message={msg} />) }
      </main>
    );
  }
}
export default MessageList;


