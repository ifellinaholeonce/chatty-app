import React, {Component} from 'react';
import Message from './Message.jsx';
import MessageList from './MessageList.jsx';
import ChatBar from './ChatBar.jsx';
import NavBar from './NavBar.jsx'

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentUser: {name: "Anonymous"}, //Initial user name (immediately changed with server connection)
      userCount: 0, //updated from the server
      messages: [], //updated from the server, sent to child components to display messages
      messageHistory: [], //history of messages sent by this client (for up and down arrow feature)
      messageHistoryIndex: 0, //Used to keep track of the message array for up and down arrow feature
    };
  }

  componentDidMount = () => {
    //Connect to server once the component mounts
    this.connection = new WebSocket("ws://127.0.0.1:3001");
    this.connection.onopen = () => {
      console.log("Connected to server as:", this.state.currentUser);
    };
    this.connection.onmessage = (event) => {
      //immedaitely parse all data from the server
      let message = JSON.parse(event.data);
      let messages = [] //temp holds all messages for updating App State

      //handle different message types sent by the server
      switch(message.type){
        case "incomingUserInit":
          this.initUser(message); //Initiates the user on connect. Set's username and assigns colour
          break;
        case "incomingUserCount":
          this.setState({userCount: message.content}) //updates the number of users online
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
      tempName: message.name //Is used to hold old usernames for sending name change notification
    })
  }

  //Called on Key Up from ChatBar child component
  newMessage = (e) => {
    if (e.key === "Enter") { //If the user presses Enter, send the data to the server
      let msg = e.target.value;
      if (msg !== "") { //Only send if it is not empty
        const newMessage = {
          type: "postMessage",
          username: this.state.currentUser.name,
          colour: this.state.currentUser.colour,
          content: msg
        };
        this.connection.send(JSON.stringify(newMessage)); //Stringify to send over WS
        this.state.messageHistory.unshift(newMessage); //Add the message to the beginning of this client's message history
        //Update the message history and set the index to 0.
        let messageHistory = this.state.messageHistory;
        this.setState({
          messageHistory: messageHistory,
          messageHistoryIndex: 0
        })
        e.target.value = "" //set the chatbar to empty
      }
    }
    //Key up and Key Down feature
    //Still part of newMessage, so it is called on Key Up
    if (e.key === "ArrowUp") {
      let index = this.state.messageHistoryIndex; //Get the current index
      e.target.value = this.state.messageHistory[index].content; //Write the message into the chat bar
      if (index < this.state.messageHistory.length -1) {
        index++; //Update the index as long as the number is still valid
      }
      this.setState({messageHistoryIndex: index}) //Update the index in the App State
    }
    if (e.key === "ArrowDown") {
      let index = this.state.messageHistoryIndex -1; //Get the current index -1
      if (index > 0) {
        e.target.value = this.state.messageHistory[index-1].content; //As long as it is not the last element, write the message into the chat bar
      }
      if (index <= 0) {
        e.target.value = ""; //Otherwise set the chatbar to blank
        index = 0; //prevent setting index to negative numbers
      }
      this.setState({messageHistoryIndex: index})
    }
  }

  newUserName = (e) => {
    //Update username as key is pressed
    const userName = e.target.value
    this.setState({
      currentUser: {name : userName},
    })
  }

  //Send the name change to server onBlur
  notifyNameChange = (e) => {
    const oldUserName = this.state.tempName //Holds the old username. It is NOT updated as the user types the new name, only onBlur
    const currentUserName = this.state.currentUser.name
    const notification = {"type": "postNotification", content: oldUserName + " changed name to " + currentUserName}
    if (oldUserName !== currentUserName) { //As long as they actually changed their username
      this.connection.send(JSON.stringify(notification));
      this.setState({
        tempName: this.state.currentUser.name //update the old username to the new one
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
