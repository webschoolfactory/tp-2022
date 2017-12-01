// Setup basic express server
const http = require('http');
const express = require('express');
const socketIo = require('socket.io');
const bluebird = require('bluebird');
const redis = require('socket.io-redis');
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
const adapter = process.env.REDIS_URL ? redis({url: process.env.REDIS_URL}) :
  redis({ host: process.env.REDIS_HOST || 'localhost', port: 6379 });
io.adapter(adapter);

bluebird.promisifyAll(adapter.pubClient);

io.on('connection', function(socket) {
  socket.addedUser = false;
  // when the client emits 'new message', this listens and executes
  socket.on('new message', chat.newMessage(socket, adapter.pubClient));

  // when the client emits 'add user', this listens and executes
  socket.on('add user', chat.addUser(socket, adapter.pubClient));

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', chat.typing(socket, adapter.pubClient));

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', chat.stopTyping(socket, adapter.pubClient));

  // when the user disconnects.. perform this
  socket.on('disconnect', chat.disconnect(socket, adapter.pubClient));
});
