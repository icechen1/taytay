var io = require('socket.io');

function runSocketServer(http, move) {
  io = io.listen(http);

  io.settings.log = false;
  var commandQueue = [];
  var last_pic;
  var last_webcam;

  function parseCommand(msg){
      var command = msg.message.toLowerCase().split(' '); //split the message
      var operator = command[0]; //First word of the command
      switch(operator.toLowerCase()){
              case 'forward':
                move('forward')
                break;
              case 'backward':
                move('backward')
                break;
              case 'left':
                move('left')
                break;
              case 'right':
                move('right')
                break;
              case 'stop':
                move('stop')
                break;
              default:
                //throw New Error('shit');
                console.log('asdf')
                break;
      }
  }

  var online = 0;
  io.sockets.on('connection', function(socket){
    online++;
    io.sockets.emit('command', {
      'username': '',
      'message': '' + online + ' user' + (online==1?'':'s') + ' connected'
    });
    socket.on('disconnect', function () {
      socket.emit('disconnected');
      online = online - 1;
    });
    socket.on('command', function(msg){
        console.log(msg);
        parseCommand(msg);
        io.sockets.emit('command', msg);
    });
    io.emit('command',{username:'Server',message:'listening on port '+ process.env.PORT});
  });
}

module.exports = runSocketServer;
