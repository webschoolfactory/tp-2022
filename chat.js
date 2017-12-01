let numUsers = 0;

const newMessage = socket => data => {
  // we tell the client to execute 'new message'
  socket.broadcast.emit('new message', {
    username: socket.username,
    message: data
  });
};

const clearUsers = () => {
  numUsers = 0;
};

// when the client emits 'add user', this listens and executes
const addUser = socket => username => {
  if (socket.addedUser) return;

  // we store the username in the socket session for this client
  socket.username = username;
  ++numUsers;
  socket.addedUser = true;
  socket.emit('login', {
    numUsers: numUsers
  });
  // echo globally (all clients) that a person has connected
  socket.broadcast.emit('user joined', {
    username: socket.username,
    numUsers: numUsers
  });
};

// when the client emits 'typing', we broadcast it to others
const typing = socket => () => {
  socket.broadcast.emit('typing', {
    username: socket.username
  });
};

// when the client emits 'stop typing', we broadcast it to others
const stopTyping = socket => () => {
  socket.broadcast.emit('stop typing', {
    username: socket.username
  });
};

// when the user disconnects.. perform this
const disconnect = socket => () => {
  if (socket.addedUser) {
    --numUsers;

    // echo globally that this client has left
    socket.broadcast.emit('user left',
    {
      username: socket.username,
      numUsers: numUsers
    });
  }
};

exports.newMessage = newMessage;
exports.addUser = addUser;
exports.typing = typing;
exports.stopTyping = stopTyping;
exports.disconnect = disconnect;
exports.clearUsers = clearUsers;
