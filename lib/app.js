
'use strict';

const config = require('./config.js');
const utils = require('./utils.js');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const pm2Adapter = require('socket.io-pm2');
const { assert } = require('console');

function buildMiddleware(args) {
  args = utils.assertObject(args);
  //
  let app = express();
  //
  app.use(express.static(utils.getStaticDir()));
  app.use(express.json({ limit: config.body_maxsize }));
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
    utils.localog("Send a JSON object (size: %d) to channel: %s", jsonText.length, channelId);
    io.in(channelId).emit('update_editor', jsonText);
    res.send('ok');
  });
  return args;
}

function attachPublisher(args) {
  args = utils.assertObject(args);
  //
  let { app } = args;
  assert(app != null, "[app] must be not null");
  //
  let server = http.createServer(app);
  //
  let io = socketio(server);
  //
  if (utils.isPm2Enabled()) {
    io.adapter(pm2Adapter());
  }
  //
  io.origins('*:*');
  //
  let channels = {};
  //
  io.on('connection', function (socket) {
    utils.localog('Socket[%s] connected from %s', socket.id, socket.conn.remoteAddress);

    socket.on('disconnect', function(){
      utils.localog('Socket[%s] disconnected ', socket.id);
    });

    socket.on('update_editor', function (channelId, msg) {
      socket.to(channelId).emit('update_editor',msg);
    });

    socket.on('join_channel', function(channelId){
      if(channels[socket.id]){
        socket.leave(channels[socket.id]);
      }
      utils.localog("Socket[%s] joining channel[%s]", socket.id, channelId);
      socket.join(channelId);
      //keep track the socket channel
      channels[socket.id] = channelId;
    });
  });

  return Object.assign(args, { server, io });
}

function startServer(args) {
  let { server } = args;
  const s = server.listen(config.port, config.host, function () {
    let port = s.address().port;
    let host = s.address().address;
    console.log('webserver is listening on http://%s:%s', host, port);
  });
}

let chain = [
  buildMiddleware,
  attachPublisher,
  attachBackendApi,
  startServer
];

chain.reduce(function(prevArgs, operator) {
  return operator(prevArgs);
}, {});
