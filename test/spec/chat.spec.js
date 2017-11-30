const assert = require('assert');
const redis = require('redis');
const bluebird = require('bluebird');

const client = redis.createClient();
bluebird.promisifyAll(client);
const chat = require('../../chat');

describe('chat', function() {
  it('should clear', function() {
    chat.clearUsers(null, client)();
    return client.getAsync('numusers')
    .then(numUsers => {
      return assert.deepEqual(numUsers, 0);
    });
  });

  it('should broadcast new message', function(done) {
    const socket = {
      broadcast: {
        emit: function(type, msg) {
          assert.deepEqual(type, 'new message');
          assert.deepEqual(msg, {
            username: 'loic',
            message: 'yolo'
          });
          done();
        }
      }
    };
    socket.username = 'loic';
    const newMessage = chat.newMessage(socket, client);
    newMessage('yolo');
  });

  it('should show typing', function(done) {
    const socket = {
      broadcast: {
        emit: function(type, msg) {
          assert.deepEqual(type, 'typing');
          assert.deepEqual(msg, {
            username: 'loic'
          });
          done();
        }
      }
    };
    socket.username = 'loic';
    const typing = chat.typing(socket, client);
    typing();
  });

  it('should add new user', function(done) {
    const socket = {
      emit: function(type, msg) {
        assert.deepEqual(type, 'login');
         assert.deepEqual(msg, {
            numUsers: 1
          });
      },
      broadcast: {
        emit: function(type, msg) {
          assert.deepEqual(type, 'user joined');
          assert.deepEqual(msg, {
            username: 'loic',
            numUsers: 1
          });
          done();
        }
      }
    };
    socket.username = 'loic';
    const addUser = chat.addUser(socket, client);
    addUser('loic');
  });

    it('should not add user', function(done) {
    const socket = {
      emit: function(type, msg) {
        done(new Error('should not be executed'));
      }
    };
    socket.username = 'loic';
    socket.addedUser = true;
    const addUser = chat.addUser(socket, client);
    addUser('loic');
    done();
  });

  it('should stop typing', function(done) {
    const socket = {
      broadcast: {
        emit: function(type, msg) {
          assert.deepEqual(type, 'stop typing');
          assert.deepEqual(msg, {
            username: 'loic'
          });
          done();
        }
      }
    };
    socket.username = 'loic';
    const stopTyping = chat.stopTyping(socket, client);
    stopTyping();
  });

  it('should show disconnect', function(done) {
    const socket = {
      broadcast: {
        emit: function(type, msg) {
          assert.deepEqual(type, 'user left');
          assert.deepEqual(msg, {
            username: 'loic',
            numUsers: 0
          });
          done();
        }
      }
    };
    socket.username = 'loic';
    socket.addedUser = true;
    const disconnect = chat.disconnect(socket, client);
    disconnect('loic');
  });

  it('should show not disconnect', function(done) {
    const socket = {
      broadcast: {
        emit: function(type, msg) {
          done(new Error('should not execute this code'));
        }
      }
    };
    socket.username = 'loic';
    socket.addedUser = false;
    const disconnect = chat.disconnect(socket, client);
    disconnect('loic');
    done();
  });
});


