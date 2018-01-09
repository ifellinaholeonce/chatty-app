import React, {Component} from 'react';
import Message from './Message.jsx';
import MessageList from './MessageList.jsx';
import ChatBar from './ChatBar.jsx';


class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentUser: "Bob",
      messages: [
        {
          username: "Bob",
          content: "Has anyone seen my marbles?",
          id: "01",
        },
        {
          username: "Jane",
          content: "How do you test in React?!",
          id: "02",
        },
      ]
    };
  }

  render() {
    return (
    <div>
      <nav className="navbar">
        <a href="/" className="navbar-brand">Chatty</a>
      </nav>
      <main className="messages">
        <MessageList messages = {this.state.messages} />
      </main>
        <ChatBar currentUser = {this.state.currentUser} />
    </div>
    );
  }
}
export default App;
