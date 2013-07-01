define(
	[
		'views/chat',
		'views/game',
		'models/user',
		'config',
		'collections/users'
	],
	function (
		ChatView,
		GameView,
		UserModel,
		cfg,
		UsersCollection
	) {

		var usersCollection;
		var current_user;
		var game_type;

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
				console.log(i)
				console.log(count)
				console.log(cfg.to_win)
				if(count >= cfg.to_win){
					alert(usersCollection.at(current_user).get('username'));
					break;
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
					if(!check(squre)){
						current_user++;
						if(current_user == usersCollection.length)
							current_user -= usersCollection.length;
					}
				}
			}
		}

		var playground_init = function(){
			current_user = 0;

			ChatView.render();

			var gameView = new GameView;
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
							game_type = 'local';
							usersCollection.each(function(user){
								if(user.get('local') === false){
									game_type = 'online';
								}
							});
							playground_init();
						}
					}
				,
				this
			);
			init_user();
		}

		return {
			start: start
		}
	}
);