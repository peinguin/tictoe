var requirejs = require('requirejs');
requirejs.config({
	paths: {
    	config: '../client/app/config',
    }
});

var games = {};

var app = require('http').createServer();
var io = require('socket.io').listen(app);
io.on('connection', function(socket){
	socket.on('event', function(data){});
	socket.on('find game', function(data){
		console.log(data);
	});
	socket.on('set nickname', function (name) {
    socket.set('nickname', name, function () {
    	socket.emit('ready');
    	console.log(name);
    });
  });
});

requirejs(['config'],
function   (config) {
    app.listen(config.port);
});

