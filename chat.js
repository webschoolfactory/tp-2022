  const newMessage = socket => data => {
    // we tell the client to execute 'new message'
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
  };

  // when the client emits 'add user', this listens and executes
  const addUser = (socket, redis) => username => {
    if (socket.addedUser) return;

    // we store the username in the socket session for this client
    socket.username = username;

    return redis.getAsync('numusers')
    .then(function(_numUsers) {
      var numUsers = _numUsers;
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
        return redis.set('numusers', numUsers);
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
  const disconnect = (socket, redis) => () => {
    if (socket.addedUser) {
      return redis.getAsync('numusers')
      .then(function(_numUsers) {
        var numUsers = _numUsers;
        --numUsers;
        // echo globally that this client has left
        socket.broadcast.emit('user left', {
          username: socket.username,
          numUsers: numUsers
        });
        return redis.set('numusers', numUsers);
        });
      }
  };

  const clearUsers = (sockect, redis) => () => {
    return redis.set('numusers', 0);
  };

exports.clearUsers = clearUsers;
exports.newMessage = newMessage;
exports.addUser = addUser;
exports.typing = typing;
exports.stopTyping = stopTyping;
exports.disconnect = disconnect;
