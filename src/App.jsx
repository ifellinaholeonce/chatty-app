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
      messages: [],
      messageHistory: [],
      messageHistoryIndex: 0,
    };
  }

  componentDidMount = () => {
    this.connection = new WebSocket("ws://127.0.0.1:3001");
    this.connection.onopen = () => {
      console.log("Connected to server as:", this.state.currentUser);
    };
    this.connection.onmessage = (event) => {
      let message = JSON.parse(event.data);
      let messages = []

      switch(message.type){
        case "incomingUserInit":
          this.initUser(message);
          break;
        case "incomingUserCount":
          this.setState({userCount: message.content})
          break;
        case "incomingMessage":
          messages = this.state.messages.concat(message);
          this.setState({messages});
          break;
        case "incomingNotification":
          messages = this.state.messages.concat(message);
          this.setState({messages});
          break;
      }

      }
  }

  initUser = (message) => {
    this.setState({
      currentUser: {
        name: message.name,
        colour: message.colour
      },
      tempName: message.name
    })
  }

  newMessage = (e) => {
    if (e.key === "Enter") {
      let msg = e.target.value;
      if (msg !== "") {
        const newMessage = {
          type: "postMessage",
          username: this.state.currentUser.name,
          colour: this.state.currentUser.colour,
          content: msg
        };
        this.connection.send(JSON.stringify(newMessage));
        this.state.messageHistory.unshift(newMessage);
        let messageHistory = this.state.messageHistory;
        this.setState({
          messageHistory,
          messageHistoryIndex: 0
        })
        e.target.value = ""
      }
    }
    if (e.key === "ArrowUp") {
      let index = this.state.messageHistoryIndex;
      e.target.value = this.state.messageHistory[index].content;
      if (index < this.state.messageHistory.length -1) {
        index++;
      }
      this.setState({messageHistoryIndex: index})
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
          currentUser = {this.state.currentUser}
          newMessage={this.newMessage}
          newUserName={this.newUserName}
          notifyNameChange={this.notifyNameChange}
        />
    </div>
    );
  }
}
export default App;
