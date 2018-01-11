let express = require('express');
const SocketServer = require('ws');
const uuidv4 = require('uuid/v4');

// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer.Server({ server });

//When the user connects assign them an Anonymous Animal ala google
let randomName = () => {
  let choices = ["Cat", "Monkey", "Aardvark", "Bear"]
  let rnd = Math.floor(Math.random() * choices.length);
  return "Anonymous " + choices[rnd];
}

//When the user connects assign them a random colour
let randomColour = () => {
  let choices = ["#4286f4", "#48a04f", "#a04948", "#6248a0"]
  let rnd = Math.floor(Math.random() * choices.length);
  return choices[rnd];
}

//When a user connects/disconnects update the count for everyone
let updateUserCount = (count) => {
  let message = {
    type: "incomingUserCount",
    content: count
  }
  wss.broadcast(message)
}

//Send the init user to just the user that connected
let initNewUser = (user) => {
  let message = {
    type: "incomingUserInit",
    name: randomName(),
    colour: randomColour()
  }
  user.send(JSON.stringify(message))
}

//All other messages should be broadcast to everyone connected
wss.broadcast = (message) => {
  wss.clients.forEach((client) => {
    if (client.readyState === SocketServer.OPEN){ //check that the websocket connection is open
      data = JSON.stringify(message); //stringify the data
      client.send(data);
      console.log(data);
    }
  })
}
// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
wss.on('connection', (ws) => {
  console.log('Client connected');
  updateUserCount(wss.clients.size)
  initNewUser(ws);
  ws.on('message', function incoming(message) {
    message = JSON.parse(message); //immediately parse the data to json
    message.id = uuidv4();
    //set the type for return the message
    if (message.type === "postMessage") {
      message.type = "incomingMessage"
    }
    if (message.type === "postNotification") {
      message.type = "incomingNotification"
    }
    wss.broadcast(message);
  });

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => {
    console.log('Client disconnected');
    updateUserCount(wss.clients.size)
  });
});
