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

let randomName = () => {
  let choices = ["Cat", "Monkey", "Aardvark", "Bear"]
  let rnd = Math.floor(Math.random() * choices.length);
  return "Anonymous " + choices[rnd];
}

let randomColour = () => {
  let choices = ["#4286f4", "#48a04f", "#a04948", "#6248a0"]
  let rnd = Math.floor(Math.random() * choices.length);
  return choices[rnd];
}

let updateUserCount = (count) => {
  let message = {
    type: "incomingUserCount",
    content: count
  }
  wss.broadcast(message)
}

let initNewUser = (user) => {
  let message = {
    type: "incomingUserInit",
    name: randomName(),
    colour: randomColour()
  }
  user.send(JSON.stringify(message))
}

wss.broadcast = (message) => {
  wss.clients.forEach((client) => {
    if (client.readyState === SocketServer.OPEN){
      data = JSON.stringify(message);
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
    message = JSON.parse(message);
    message.id = uuidv4();
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

