// Setup basic express server
const http = require('http');
const express = require('express');
const socketIo = require('socket.io');
const chat = require('./chat');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const port = process.env.PORT || 3000;

server.listen(port, function() {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));

// Chatroom

io.on('connection', function(socket) {
  socket.addedUser = false;
  // when the client emits 'new message', this listens and executes
  socket.on('new message', chat.newMessage(socket));

  // when the client emits 'add user', this listens and executes
  socket.on('add user', chat.addUser(socket));

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', chat.typing(socket));

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', chat.stopTyping(socket));

  // when the user disconnects.. perform this
  socket.on('disconnect', chat.disconnect(socket));
});
