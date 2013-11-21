var express = require('express');
var app     = express();
var server  = require('http').createServer(app);
var io      = require('socket.io').listen(server);

server.listen(process.env.PORT || 80);

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.render('index');
});

app.get('/info/:screen', function (req, res) {
  res.render('screens/' + req.param('screen'));
});