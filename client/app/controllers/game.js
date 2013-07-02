define(
	[
		'views/chat',
		'views/game',
		'models/user',
		'config',
		'collections/users',
		'socket.io',
		'views/alert'
	],
	function (
		ChatView,
		GameView,
		UserModel,
		cfg,
		UsersCollection,
		io,
		AlertView
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

		var check = function(squre){

			var elems = squre.parent().children();

			var index = elems.index(squre);

			var x = index % cfg.height;
			var y = Math.floor(index / cfg.height);

			var get = function(x, y){
				if(x >= 0 && y >= 0 && x < cfg.width && y < cfg.height && elems[x + y*cfg.height])
					return $(elems[x + y*cfg.height]);
				else
					return false;
			}

			for(i in _.range(4)){
				var elem;
				var count = 1;
				if(i == 0){
					var tmp_x = x-1;
					var tmp_y = y-1;
					while((elem = get(tmp_x, tmp_y)) && parseInt(elem.text()) == current_user){
						tmp_x--;
						tmp_y--;
						count++;
					}

					var tmp_x = x+1;
					var tmp_y = y+1;
					while((elem = get(tmp_x, tmp_y)) && parseInt(elem.text()) == current_user){
						tmp_x++;
						tmp_y++;
						count++;
					}

				}
				if(i == 1){
					var tmp_x = x+1;
					var tmp_y = y-1;

					while((elem = get(tmp_x, tmp_y)) && parseInt(elem.text()) === current_user){
						tmp_x++;
						tmp_y--;
						count++;
					}
					var tmp_x = x-1;
					var tmp_y = y+1;
					while((elem = get(tmp_x, tmp_y)) && parseInt(elem.text()) === current_user){
						tmp_x--;
						tmp_y++;
						count++;
					}
				}
				if(i == 2){
					var tmp_x = x+1;

					while((elem = get(tmp_x, y)) && parseInt(elem.text()) === current_user){
						tmp_x++;
						count++;
					}
					var tmp_x = x-1;
					while((elem = get(tmp_x, y)) && parseInt(elem.text()) === current_user){
						tmp_x--;
						count++;
					}
				}
				if(i == 3){
					var tmp_y = y+1;

					while((elem = get(x, tmp_y)) && parseInt(elem.text()) === current_user){
						tmp_y++;
						count++;
					}
					var tmp_y = y-1;
					while((elem = get(x, tmp_y)) && parseInt(elem.text()) === current_user){
						tmp_y--;
						count++;
					}
				}

				if(count >= cfg.to_win){
					return usersCollection.at(current_user).get('username');
				}
				if(squre.parent().find(':empty').length == 0){
					return 'Нічия';
				}
			}

			return false;
		}

		var step = function(squre){

			var squre = $(squre);

			if(squre.text() !== '')
				return false;
			else{
				squre.text(current_user);
				var sended = false;
				var check_local = true;

				if(game_type == 'online'){
					send_to_server(squre);
				}else{
					var check = check(squre);
					if(!check){
						current_user++;
						if(current_user == usersCollection.length)
							current_user -= usersCollection.length;
					}else{
						alert(check);
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

		var start = function(){

			var init_user = function(){
				var user = new UserModel;
				user.Introduce(function(){
					usersCollection.add(user);
				});
			}

			usersCollection = new UsersCollection;
			usersCollection.bind(
				"change reset add remove",
					function(){
						if(usersCollection.length < cfg.users_count){
							init_user();
						}else{

							usersCollection.unbind("change reset add remove");

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
									socket.on('new user', function(data) {

										ChatView.write('New user ' + data.username);

										var added = false;
										usersCollection.each(function(user){
											if(!added && user.get('username') === data.username){
												user.unset('cid').set({id:parseInt(data.id)});
												added = true;
											}
										});
										if(!added)
											usersCollection.each(function(user){
												if(!added && user.get('local') === false && user.get('username') == undefined){
													user.set('username', data.username);
													user.unset('cid').set({id:parseInt(data.id)});
													added = true;
												}
											});
									});
									socket.on('game', function(data) {
										data = JSON.parse(data);
										
										for(i in data.users){
											var added = false;
											usersCollection.each(function(user){
												if(!added && user.get('local') === false){
													user.set('username', parseInt(data.users[i]));
													user.unset('cid').set({id:parseInt(i)});
													added = true;
												}
											});
										}
										ChatView.write('Join to game');
									});
									socket.on('step', function(curr_user) {
										ChatView.write(usersCollection.get(curr_user).get('username') + ' turn');
										current_user = curr_user;
										var finded = false;

										if(usersCollection.get(current_user).get('local') === true){
											gameView.unblock();
										}
									});
								});
							}
						}
					}
				,
				this
			);
			init_user();
		}

		return {
			start: start,
			setRouter: setRouter
		}
	}
);