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
  res.render('screens/' + req.param('screen'), { query: req.query });
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

    socket.on('sendScript', function (data) {
      socket.broadcast.emit('scriptChange', {
        script: [{
          time: todaySeconds(),
          type: 'image',
          file: '/media/SlideTests_01-01.jpg'
        }, {
          time: todaySeconds() + 5,
          type: 'image',
          file: '/media/SlideTests_01-02.jpg'
        }, {
          time: todaySeconds() + 10,
          type: 'movie',
          file: '/media/HourglassLoop_Slow.mov'
        }, {
          time: todaySeconds() + 15,
          type: 'movie',
          file: '/media/10minutes.mov'
        }]
      });
    });
  });

});

function todaySeconds () {
  var date = new Date();
  return (date.getUTCHours() * 60 * 60) + (date.getUTCMinutes() * 60) + date.getUTCSeconds();
}