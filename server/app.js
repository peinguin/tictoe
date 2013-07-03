var requirejs = require('requirejs');

requirejs.config({
	paths: {
    	config: '../client/app/config',
    	check: '../client/app/check',
    }
});

var time_to_step = 30;
var time_for_user_wait = 60;

requirejs(
	['check', 'config'],
	function   (Check, cfg) {

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
		                field: [],
		                timeout: time_for_user_wait,
		                timer: undefined
		            });
		            roomID = games.length - 1;
		            for(i=0;i<data.config.width;i++)
		            	for(j=0;j<data.config.width;j++)
		            		games[roomID].field[i + j * data.config.width ] = '';
		            games[roomID].timer = setInterval(function(){
		            	games[roomID].timeout--;
		            	if(games[roomID].timeout > 0){
		            		io.sockets.in('room'+roomID).emit('tick', games[roomID].timeout);
		            	}else{
		            		games[roomID].started = false;
		            		io.sockets.in('room'+roomID).emit('time ower', games[roomID].timeout);
		            		clearInterval(games[roomID].timer);
		            		delete games[roomID];
		            		socket.set('roomID', undefined);
		            	}
		            }, 1000);
		        }

		        socket.join('room'+roomID);
		        socket.set('roomID', roomID, function (arguments) {
		            socket.emit('game', JSON.stringify({
		            	users: games[roomID].users,
		                started: games[roomID].started
		            }));
		            var socket_users = [];
		            for(j in data.users){
		                if(data.users[j].local == true){
		                    games[roomID].users.push(data.users[j].username);
		                    socket_users.push(games[roomID].users.length - 1);
		                    io.sockets.in('room'+roomID).emit('new user', {username: data.users[j].username, id: games[roomID].users.length - 1});
		                }
		            }
		            socket.set('socket_users', socket_users);
		            if(games[roomID].users_count == games[roomID].users.length){
		                games[roomID].started = true;
		                games[roomID].timeout = time_to_step;
		                io.sockets.in('room'+roomID).emit('step', {data: games[roomID].field, current_user: games[roomID].current_user});
		            }
		        });
			});
			socket.on('step', function(asdfasdfasdfasdf){

				var roomID = undefined;
				var socket_users = undefined;

				var processor = function(){
					if(
						roomID !== undefined &&
						socket_users &&
						games[roomID] &&
						games[roomID].started &&
						socket_users.indexOf(games[roomID].current_user) >= 0
					){
						var x = asdfasdfasdfasdf.x;
						var y = asdfasdfasdfasdf.y;
						games[roomID].timeout = time_to_step;
						games[roomID].field[x + y * cfg.width] = games[roomID].current_user;
						var check = Check.check(
							x,
							y,
							games[roomID].current_user,
							function(x, y){
								if(
									x >= 0 &&
									y >= 0 &&
									x < cfg.width &&
									y < cfg.height &&
									games[roomID].field[x + y*cfg.width] !== undefined &&
									games[roomID].field[x + y*cfg.width] !== ''
								)
									return parseInt(games[roomID].field[x + y*cfg.width]);
								else
									return false;
							}
						);
						var data;
						if(check === false){
							data = games[roomID].field;
						}else{
							data = check;
							games[roomID].started = false;
		            		clearInterval(games[roomID].timer);
		            		delete items[games[roomID]];
		            		socket.set('roomID', undefined);
						}

						games[roomID].current_user++;
						if(games[roomID].current_user >= games[roomID].users_count)
							games[roomID].current_user -= games[roomID].users_count;

						io.sockets.in('room'+roomID).emit('step', {data: data, current_user: games[roomID].current_user});
					}
				}

				socket.get('roomID', function (error, rID) {
					roomID = rID;
					processor();
				});

				socket.get('socket_users', function (error, value) {
					socket_users = value;
					processor();
				});
			});
		});

		app.listen(cfg.port);
	}
);