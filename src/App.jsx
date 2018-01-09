import React, {Component} from 'react';
import Message from './Message.jsx';
import MessageList from './MessageList.jsx';
import ChatBar from './ChatBar.jsx';



class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentUser: {name: "Anonymous"},
      messages: []
    };
  }

  componentDidMount = () => {
    this.connection = new WebSocket("ws://127.0.0.1:3001");
    this.connection.onopen = () => {
      console.log("Connected to server as:", this.state.currentUser);
    };
    this.connection.onmessage = (event) => {
      let message = JSON.parse(event.data);
      const messages = this.state.messages.concat(message);
      this.setState({messages});
    }

  }

  newMessage = (e) => {
    if (e.key === "Enter") {
      let msg = e.target.value;
      const newMessage = {username: this.state.currentUser.name, content: msg};
      this.connection.send(JSON.stringify(newMessage));
      e.target.value = ""
    }
  }

  newUserName = (e) => {
    const userName = e.target.value
    console.log(e.target.value)
    this.setState({currentUser: {name : userName}})
  }

  render() {
    return (
    <div>
      <nav className="navbar">
        <a href="/" className="navbar-brand">Chatty</a>
      </nav>
        <MessageList messages = {this.state.messages} />
        <ChatBar currentUser = {this.state.currentUser.name} newMessage={this.newMessage} newUserName={this.newUserName}/>
    </div>
    );
  }
}
export default App;
