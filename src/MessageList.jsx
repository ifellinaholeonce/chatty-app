import React, {Component} from 'react';
import Message from './Message.jsx';
import MessageSystem from './MessageSystem.jsx';

class MessageList extends Component {


  render() {
    return (
      <main className="messages">
        { this.props.messages.map((msg) =>
          {
            if (msg.type === "incomingMessage"){
              return <Message key={msg.id} message={msg} />
            }
            if (msg.type === "incomingNotification"){
              return <MessageSystem key={msg.id} message={msg} />
            }
          })
        }
      </main>
    );
  }
}
export default MessageList;


