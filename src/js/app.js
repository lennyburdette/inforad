var socket = io.connect();

var options = {
  'default': '/info/clock',
  date: '/info/date'
};

if ('host' in window) {
  socket.emit('register', { host: window.host });

  socket.on('change', function (data) {
    document.getElementById('frame').src = options[data.screen];
  });

} else if ('controller' in window) {
  socket.emit('subscribe');

  var allClients = [];
  clients.forEach(function (clientName) {
    allClients.push({
      name: clientName,
      screen: 'default'
    });
  });

  var clientsUI = new Ractive({
    el: document.getElementById('clients'),
    template: document.getElementById('tmplClients').innerHTML,
    data: {
      clients: allClients,
      options: options,
      currentScreen: null
    }
  });

  clientsUI.on('changeClient', function (event) {
    setTimeout(function () {
      console.log('change client', event.context.name, 'to', event.context.screen);
      socket.emit('clientChange', {
        client: event.context.name,
        screen: event.context.screen
      });
    }, 0);
  });

  clientsUI.on('changeAllClients', function (event) {
    console.log('change all clients to', clientsUI.get('currentScreen'));
    clientsUI.get('clients').forEach(function (client, i) {
      clientsUI.set('clients.' + i + '.screen', clientsUI.get('currentScreen'));
    });
    socket.emit('allClientChange', { screen: clientsUI.get('currentScreen') });
  });

  socket.on('clientDisconnected', function (clientName) {
    var index = -1;
    for (var i = 0, l = clientsUI.get('clients').length; i < l; i++) {
      if (clientsUI.get('clients')[i].name === clientName) {
        index = i;
        break;
      }
    }
    if (index >= 0) {
      clientsUI.get('clients').splice(index, 1);
    }
  });

  socket.on('clientConnected', function (clientName) {
    clientsUI.get('clients').push({
      name: clientName,
      screen: 'default'
    });
  });

}
