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

  componentDidMount() {
  console.log("componentDidMount <App />");
  setTimeout(() => {
    console.log("Simulating incoming message");
    // Add a new message to the list of messages in the data store
    const newMessage = {id: 3, username: "Michelle", content: "Hello there!"};
    const messages = this.state.messages.concat(newMessage)
    // Update the state of the app component.
    // Calling setState will trigger a call to render() in App and all child components.
    this.setState({messages: messages})
    }, 3000);
  }

  newMessage = (e) => {
    if (e.key === "Enter") {
      const msg = e.target.value;
      const newMessage = {username: this.state.currentUser, content: msg, id: (this.state.messages.length + 1)};
      const messages = this.state.messages.concat(newMessage);
      this.setState({messages : messages});
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
