define(
	[
		'views/chat',
		'views/game',
		'models/user',
		'config',
		'collections/users',
		'socket.io',
		'views/alert',
		'check'
	],
	function (
		ChatView,
		GameView,
		UserModel,
		cfg,
		UsersCollection,
		io,
		AlertView,
		Check
	) {

		var router;

		var setRouter = function(r){
			router = r;
		}

		var usersCollection;
		var current_user;
		var game_type;
		var socket;
		var gameView;

		var NoOne = function(){
			alert('No one');
		}

		var Winner = function(winner){
			alert(winner);
		}

		var step = function(squre){

			var squre = $(squre);

			if(squre.text() !== '')
				return false;
			else{
				squre.text(current_user);
				var sended = false;
				var check_local = true;

				var elems = squre.parent().children();
				var index = elems.index(squre);
				var x = index % cfg.height;
				var y = Math.floor(index / cfg.height);

				if(game_type == 'online'){
					gameView.block();
					socket.emit('step', {x: x, y: y});
				}else{
					var check = Check.check(
						x,
						y,
						current_user,
						function(x, y){
							x = parseInt(x);
							y = parseInt(y);

							var result = false;
							if(
								x >= 0 &&
								y >= 0 &&
								x < cfg.width &&
								y < cfg.height &&
								elems[x + y*cfg.width] !== undefined
							){
								result = $(elems[x + y*cfg.width]).text();
								if(result == '')
									result = false;
								else
									result = parseInt(result);
							}
							return result;
						}
					);
					if(check === false){
						current_user++;
						if(current_user == usersCollection.length)
							current_user -= usersCollection.length;
					}else if(check === -1){
						NoOne();
					}else{
						Winner(usersCollection.at(check).get('username'));
					}
				}
			}
		}

		var playground_init = function(){
			current_user = 0;

			ChatView.render();

			gameView = new GameView;
			gameView.step = step;
			gameView.render();	
		}

		var addUser = function(username, id){
			var added = false;
			usersCollection.each(function(user){
				if(!added && user.get('username') === username){
					user.cid = parseInt(id);
					user.set({
						id:parseInt(id)
					});
					added = true;
				}
			});
			if(!added)
				usersCollection.each(function(user){
					if(!added && user.get('local') === false && user.get('username') == undefined){
						user.set('username', username);
						user.cid = parseInt(id);
						user.set({
							id:parseInt(id)
						});
						added = true;
					}
				});
		}

		var start = function(){

			var init_user = function(){
				var user = new UserModel;
				user.Introduce(function(){
					usersCollection.add(user);
				});
			}

			var board_full = function(){
				game_type = 'local';
				usersCollection.each(function(user){
					if(user.get('local') === false){
						game_type = 'online';
					}
				});

				playground_init();

				if(game_type == 'online'){
					gameView.block();
					AlertView.render('Wait for other players');
					socket = io.connect('http://localhost:'+cfg.port, { 'reconnect': false, 'connect timeout': 100, 'force new connection': true});
					socket.on('error', function () {
						AlertView.render('Connection error.Trying');
						router.trigger("route:defaultAction");
					});
					socket.on('connect', function () {
						socket.emit('find game', { config: cfg, users: usersCollection.toJSON() });
						socket.on('game', function(data) {
							data = JSON.parse(data);
							for(i in data.users){
								addUser(data.users[i], i);
							}
							ChatView.write('Join to game');

							socket.on('new user', function(data) {

								ChatView.write('New user ' + data.username);
								addUser(data.username, data.id);
							});
						});
						socket.on('step', function(data) {
							AlertView.empty();
							current_user = data.current_user;

							if(typeof(data.data) == "object"){
								for(i in data.data){
									$('.field').eq(i).text(data.data[i]);
								}
							}else if(data.data === -1){
								NoOne();
							}else{
								Winner(usersCollection.get(data.data).get('username'));
							}

							ChatView.write(usersCollection.get(current_user).get('username') + ' turn');

							if(usersCollection.get(current_user).get('local') === true){
								gameView.unblock();
							}
						});
						socket.on('disconnect', function() {
							alert('disconnected');
							router.trigger("route:defaultAction");
						});
					});
				}
			};

			usersCollection = new UsersCollection;
			usersCollection.bind(
				"change reset add remove",
				function(){
					if(usersCollection.length < cfg.users_count){
						init_user();
					}else{
						usersCollection.unbind("change reset add remove");
						board_full();
					}
				},
				this)
			;
			init_user();
		}

		return {
			start: start,
			setRouter: setRouter
		}
	}
);