
const config = require('./config.js');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const pm2Adapter = require('socket.io-pm2');
const { assert } = require('console');

function assertObject(args) {
  return args || {};
}

function localog(msg, ...args) {
  console.log.call(console, msg, ...args);
}

function buildMiddleware(args) {
  args = assertObject(args);
  //
  let app = express();
  //
  app.use(express.static('public'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  //
  return Object.assign(args, { app });
}

function attachBackendApi(args) {
  let {app, io} = args;
  assert(app != null, "[app] must be not null");
  assert(io != null, "[io] must be not null");
  //
  app.put('/api/update/:channelId',function(req, res, next) {
    let channelId = req.params.channelId;
    let jsonText = JSON.stringify(req.body);
    localog("Send a JSON object (size: %d) to channel: %s", jsonText.length, channelId);
    io.in(channelId).emit('editor_update', jsonText);
    res.send('ok');
  });
  return args;
}

function attachPublisher(args) {
  args = assertObject(args);
  //
  let { app } = args;
  assert(app != null, "[app] must be not null");
  //
  let server = http.createServer(app);
  //
  let io = socketio(server);
  io.adapter(pm2Adapter());
  io.origins('*:*');
  //
  let channels = {};
  //
  io.on('connection', function (socket) {
    localog('Socket[%s] connected from %s', socket.id, socket.conn.remoteAddress);

    socket.on('disconnect', function(){
      localog('Socket[%d] disconnected ', socket.id);
    });

    socket.on('editor_update', function (channelId, msg) {
      socket.to(channelId).emit('editor_update',msg);
    });

    socket.on('join_channel', function(channelId){
      if(channels[socket.id]){
        socket.leave(channels[socket.id]);
      }
      localog("Socket[%s] joining channel[%s]", socket.id, channelId);
      socket.join(channelId);
      //keep track the socket channel
      channels[socket.id] = channelId;
    });
  });

  return Object.assign(args, { server, io });
}

function startServer(args) {
  let server = args.server;
  console.log('Server listening on: ' + config.port);
  server.listen(config.port);
}

let chain = [
  buildMiddleware,
  attachPublisher,
  attachBackendApi,
  startServer
];

let output = chain.reduce(function(prevArgs, operator) {
  return operator(prevArgs);
}, {});
