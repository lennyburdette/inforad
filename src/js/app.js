var socket = io.connect();

var options = {
  'default': '/info/clock',
  date: '/info/date',
  gradient: '/info/gradient'
};

if ('host' in window) {
  socket.emit('register', { host: window.host });
  var frame = document.getElementById('frame');

  socket.on('change', function (data) {
    clearInterval(timer);
    change({
      type: 'url',
      url: options[data.screen]
    });
  });

  socket.on('scriptChange', function (data) {
    clearInterval(timer);
    startScript(data.script);
  });

  var currentScript;
  var currentSceneIndex = 0;
  function startScript (script) {
    currentScript = script;
    var currentSceneIndex = findCurrentScene();
    change(currentScript[currentSceneIndex]);
    startTimer();
  }

  function findCurrentScene () {
    var now = todaySeconds();

    for (var i = 0, l = currentScript.length; i < l; i++) {
      if (currentScript[i].time > now) {
        return i - 1;
      }
    }

    return currentScript.length - 1;
  }

  var timer;
  function startTimer () {
    clearInterval(timer);
    timer = setInterval(function () {
      var newIndex = findCurrentScene();
      if (newIndex !== currentSceneIndex) {
        currentSceneIndex = newIndex;
        change(currentScript[currentSceneIndex]);
      }
    }, 333);
  }

  function change (scene) {
    frame.classList.add('changing');
    setTimeout(function () {

      if (scene && ('allowDefault' in scene) && scene.allowDefault && window.DEFAULT) {
        frame.src = DEFAULT;
      } else {
        switch (scene.type) {
          case 'url':
            frame.src = scene.url;
          break;
          case 'image':
            frame.src = '/info/image?url=' + scene.url;
          break;
          case 'movie':
            frame.src = '/info/movie?url=' + scene.url;
          break;
          case 'gradient':
            frame.src = '/info/gradient?url=' + scene.url;
          break;
          case 'slideshow':
            frame.src = '/info/slideshow?url=' + scene.url;
          break;
          case 'clock':
            frame.src = '/info/clock';
          break;
          default:
          break;
        }
      }

      setTimeout(function () {
        frame.classList.remove('changing');
      }, 300);
    }, 300);
  }










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

  var date = new Date();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var scriptUI = new Ractive({
    el: document.getElementById('script'),
    template: document.getElementById('tmplScript').innerHTML,
    data: {
      script: DEMO()
    }
  });

  scriptUI.on('removeScene', function (event, index) {
    scriptUI.get('script').splice(index, 1);
  });

  scriptUI.on('addScene', function () {
    scriptUI.get('script').push({
      timeForForm: clockTime(10),
      type: 'clock',
      url: null
    });
  });

  scriptUI.on('sendScript', function (event) {
    var script = scriptUI.get('script');
    script.forEach(function (scene) {
      var parts = scene.timeForForm.split(':');
      scene.time = parseInt(parts[0], 10) * 60 * 60 + parseInt(parts[1], 10) * 60;
    });

    socket.emit('sendScript', { script: script });
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

function clockTime (offsetMinutes) {
  offsetMinutes = offsetMinutes || 0;
  var date = new Date();
  return [date.getHours(), zeroPad((date.getMinutes() + offsetMinutes) % 60)].join(':');
}

function zeroPad (num) {
  return num < 10 ? '0' + num : num;
}

function todaySeconds () {
  var date = new Date();
  return (date.getHours() * 60 * 60) + (date.getMinutes() * 60) + date.getSeconds();
}
