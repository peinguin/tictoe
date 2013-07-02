var requirejs = require('requirejs');

requirejs.config({
	paths: {
    	config: '../client/app/config',
    }
});

var games = [];

var app = require('http').createServer();
var io = require('socket.io').listen(app, { log: false });
io.on('connection', function(socket){
	socket.on('find game', function(data){
        var finded = false;
        var roomID = undefined;

        var local_users_count = 0;
        for(j in data.users){
            if(data.users[j].local == true){
                local_users_count ++;
            }
        }

        for(i in games){
            var usernames_conflict = false;
            for(k in data.users){
                for(j in games[i].users){
                    if(
                        data.users[k].local === true &&
                        games[i].users[j] == data.users[k].username
                    ){
                        usernames_conflict = true;
                    }
                }
            }
            if(
                !finded &&
                games[i] &&
                games[i].started == false &&
                games[i].users_count == data.config.users_count &&
                games[i].width == data.config.width &&
                games[i].height == data.config.height &&
                games[i].to_win == data.config.to_win &&
                games[i].users.length <= local_users_count + data.config.users_count &&
                !usernames_conflict
            ){
                finded = true;
                roomID = i;
            }
        }
        if(!finded){
            games.push({
                users: [],
                started: false,
                current_user: 0,
                users_count: data.config.users_count,
                width: data.config.width,
                height: data.config.height,
                to_win: data.config.to_win,
                field: []
            });
            roomID = games.length - 1;
        }

        socket.join('room'+roomID);
        socket.set('roomID', roomID, function (arguments) {
            socket.emit('game', JSON.stringify( games[roomID] ));

            for(j in data.users){
                if(data.users[j].local == true){
                    games[i].users.push(data.users[j].username);
                    io.sockets.in('room'+i).emit('new user', {username: data.users[j].username, id: games[i].users.length - 1});
                }
            }

            if(games[roomID].users_count == games[roomID].users.length){
                games[roomID].started = true;
                io.sockets.in('room'+roomID).emit('step', games[roomID].current_user);
            }
        });
	});
});

requirejs(['config'],
function   (config) {
    app.listen(config.port);
});

