
var config = require('./config.js');
var express = require('express');
var http = require('http');
var socketio = require('socket.io');
const pm2Adapter = require('socket.io-pm2');

function assertObject(args) {
  return args || {};
}

function localog(msg, ...args) {
  console.log.call(console, msg, ...args);
}

function buildMiddleware(args) {
  args = assertObject(args);
  var config = assertObject(args.config);
  //
  var app = express();
  //
  app.use(express.static('public'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  //
  app.get('/api/help',function(req, res, next) {
    res.send('test');
  });
  return {app: app};
}

function attachBackendApi(args) {
  var app = args.app;
  var io = args.io;
  app.put('/api/update/:roomId',function(req, res, next) {
    var roomId = req.params.roomId;
    var jsonText = JSON.stringify(req.body);
    localog("Send a JSON object (size: %d) to channel: %s", jsonText.length, roomId);
    io.in(roomId).emit('editor_update', jsonText);
    res.send('ok');
  });
  return args;
}

function attachContentUpdater(args) {
  args = assertObject(args);
  var config = assertObject(args.config);
  var app = assertObject(args.app);

  if (config.basepath) {
    app = app.use(config.basepath, app);
  }

  var server = http.createServer(app);
  args.server = server;

  var io = socketio(server);
  io.adapter(pm2Adapter());
  args.io = io;

  io.origins('*:*');

  var socket_rooms = {};

  io.on('connection', function (socket) {
    localog('Socket[%s] connected from %s', socket.id, socket.conn.remoteAddress);

    socket.on('disconnect', function(){
      localog('Socket[%d] disconnected ', socket.id);
    });

    socket.on('editor_update', function (room, msg) {
      socket.to(room).emit('editor_update',msg);
    });

    socket.on('join_room', function(room){
      if(socket_rooms[socket.id]){
        socket.leave(socket_rooms[socket.id]);
      }
      localog("Socket[%s] joining room[%s]", socket.id, room);
      socket.join(room);
      //keep track the socket room
      socket_rooms[socket.id] = room;
    });
  });

  return args;
}

function startServer(args) {
  var server = args.server;
  console.log('Server listening on: ' + config.port);
  server.listen(config.port);
}

startServer(attachBackendApi(attachContentUpdater(buildMiddleware({ config: config }))));
