import React, {Component} from 'react';
import Message from './Message.jsx';
import MessageList from './MessageList.jsx';
import ChatBar from './ChatBar.jsx';
import NavBar from './NavBar.jsx'



class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentUser: {name: "Anonymous"},
      userCount: 0,
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
      if (message.type === "incomingUserCount") {
        this.setState({userCount: message.content})
      } else {
        const messages = this.state.messages.concat(message);
        this.setState({messages});
      }
    }
    this.setState({tempName: this.state.currentUser.name})
  }

  newMessage = (e) => {
    if (e.key === "Enter") {
      let msg = e.target.value;
      const newMessage = {"type": "postMessage", username: this.state.currentUser.name, content: msg};
      this.connection.send(JSON.stringify(newMessage));
      e.target.value = ""
    }
  }

  newUserName = (e) => {
    const userName = e.target.value
    this.setState({
      currentUser: {name : userName},
    })
  }

  notifyNameChange = (e) => {
    const oldUserName = this.state.tempName
    const currentUserName = this.state.currentUser.name
    const notification = {"type": "postNotification", content: oldUserName + " changed name to " + currentUserName}
    if (oldUserName !== currentUserName) {
      this.connection.send(JSON.stringify(notification));
      this.setState({
        tempName: this.state.currentUser.name
      })
    }
  }

  render() {
    return (
    <div>
        <NavBar userCount = {this.state.userCount}/>
        <MessageList messages = {this.state.messages} />
        <ChatBar
          currentUser = {this.state.currentUser.name}
          newMessage={this.newMessage}
          newUserName={this.newUserName}
          notifyNameChange={this.notifyNameChange}
        />
    </div>
    );
  }
}
export default App;
