var Hapi = require('hapi');
var RollingSpider = require('rolling-spider');

var server = new Hapi.Server();
var yourDrone = new RollingSpider();

// initialize drone
var init = function() {
  yourDrone.connect(function() {
    console.log('connecting to drone...');
    yourDrone.setup(function() {
      yourDrone.startPing();
    });
});
};

server.connection({
  port: 8887
});


server.route({
  path: '/takeoff',
  method: 'GET',
  handler: function(req, reply) {
    yourDrone.calibrate();
    yourDrone.takeoff();
    reply('taking off...');
  }
});

server.route({
  path: '/land',
  method: 'GET',
  handler: function(req, reply) {
    yourDrone.land();
    reply('landing!');
  }
});

// keep this at bottom due to how routes are processed
server.route({
  path: '/{param*}',
  method: 'GET',
  handler: {
    directory: { path: 'public' }
  }
});

server.start(function(err) {
  if (err) {
    console.log('Issue: ' + err);
  } else {
    console.log('Initializing...');
    init();
  }

});
