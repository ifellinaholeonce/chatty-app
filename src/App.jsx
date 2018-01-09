import React, {Component} from 'react';
import Message from './Message.jsx';
import MessageList from './MessageList.jsx';
import ChatBar from './ChatBar.jsx';



class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      socket: "ws://127.0.0.1:3001",
      currentUser: "Bob",
      messages: [
        {
          username: "Bob",
          content: "Has anyone seen my marbles?",
          id: "1",
        },
        {
          username: "Jane",
          content: "How do you test in React?!",
          id: "2",
        },
      ]
    };
  }

  componentDidMount = () => {
    this.connection = new WebSocket(this.state.socket);
    this.connection.onopen = () => {
      console.log("Connected to server as:", this.state.currentUser);
      this.connection.send('Connected ' + this.state.currentUser);
    };

  }

  newMessage = (e) => {
    if (e.key === "Enter") {
      let msg = e.target.value;
      const newMessage = {username: this.state.currentUser, content: msg, id: (this.state.messages.length + 1)};
      const messages = this.state.messages.concat(newMessage);
      this.setState({messages : messages});
      this.connection.send(this.state.currentUser + ' said ' + msg);
      e.target.value = ""
    }
  }

  render() {
    return (
    <div>
      <nav className="navbar">
        <a href="/" className="navbar-brand">Chatty</a>
      </nav>
        <MessageList messages = {this.state.messages} />
        <ChatBar currentUser = {this.state.currentUser} newMessage={this.newMessage} />
    </div>
    );
  }
}
export default App;
