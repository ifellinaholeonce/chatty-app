import React, {Component} from 'react';
import Message from './Message.jsx';

class MessageList extends Component {


  render() {
    return (
      <div className="message system">
        { this.props.messages.map((msg) => <Message key={msg.id} message={msg} />) }
      </div>
    );
  }
}
export default MessageList;


