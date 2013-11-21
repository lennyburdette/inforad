var express = require('express');
var app     = express();
var server  = require('http').createServer(app);
var io      = require('socket.io').listen(server);
var _       = require('underscore');

server.listen(process.env.PORT || 80);

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.render('index', { host: req.query.host });
});

app.get('/info/:screen', function (req, res) {
  res.render('screens/' + req.param('screen'));
});

app.get('/control', function (req, res) {
  res.render('control', { clients: _.keys(clients) });
});

var clients = {};
io.sockets.on('connection', function (socket) {
  var clientHostname;

  socket.on('register', function (data) {
    clientHostname = data.host;
    clients[data.host] = socket;
    socket.set('host', data.host);
    socket.broadcast.emit('clientConnected', data.host);

    socket.on('disconnect', function () {
      delete clients[clientHostname];
      socket.broadcast.emit('clientDisconnected', clientHostname);
    });
  });

  socket.on('subscribe', function () {
    socket.on('clientChange', function (data) {
      clients[data.client].emit('change', data);
    });

    socket.on('allClientChange', function (data) {
      socket.broadcast.emit('change', data);
    });
  });

});