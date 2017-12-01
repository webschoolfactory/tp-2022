const assert = require('assert');
const chat = require('../../chat');

describe('chat', function() {
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
    const newMessage = chat.newMessage(socket);
    newMessage('yolo');
  });

  it('should show typing', function(done) {
      done(new Error('not tested'));
  });

  it('should add new user', function(done) {
    done(new Error('not tested'));
  });

  it('should not add user', function(done) {
    done(new Error('not tested'));
  });

  it('should stop typing', function(done) {
    done(new Error('not tested'));
  });

  it('should show disconnect', function(done) {
    const socket = {
      broadcast: {
        emit: function(type, msg) {
          assert.deepEqual(type, 'user left');
          assert.deepEqual(msg, {
            username: 'loic',
            numUsers: '-1'
          });
          done();
        }
      }
      };
      socket.addedUser = true;
      socket.username = 'loic';
      socket.numUsers = 1;
      const newMessage = chat.disconnect(socket);
      newMessage('-1');
    });

  it('should show not disconnect', function(done) {
    done(new Error('not tested'));
  });
});
