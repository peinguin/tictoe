define(
	['config'],
	function(cfg){
	return {
		check: function(x, y, current_user, get){
			var i;
			var j;
			var elem;
			for(i=0;i<4;i++){ 
				var count = 1;
				for(j=0;j<2;j++){
					
					if(j == 0){
						if(i == 0){
							var tmp_x = x-1;
							var tmp_y = y-1;
						}
						if(i == 1){
							var tmp_x = x+1;
							var tmp_y = y-1;
						}
						if(i == 2){
							var tmp_x = x+1;
							var tmp_y = y;
						}
						if(i == 3){
							var tmp_x = x;
							var tmp_y = y+1;
						}
					}else{
						if(i == 0){
							var tmp_x = x+1;
							var tmp_y = y+1;
						}
						if(i == 1){
							var tmp_x = x-1;
							var tmp_y = y+1;
						}
						if(i == 2){
							var tmp_x = x-1;
							var tmp_y = y;
						}
						if(i == 3){
							var tmp_x = x;
							var tmp_y = y-1;
						}
					}
					while(get(tmp_x, tmp_y) === current_user){
						if(j == 0){
							if(i == 0){
								tmp_x--;
								tmp_y--;
							}
							if(i == 1){
								tmp_x++;
								tmp_y--;
							}
							if(i == 2){
								tmp_x++;
							}
							if(i == 3){
								tmp_y++;
							}
						}else{
							if(i == 0){
								tmp_x++;
								tmp_y++;
							}
							if(i == 1){
								tmp_x--;
								tmp_y++;
							}
							if(i == 2){
								tmp_x--;
							}
							if(i == 3){
								tmp_y--;
							}
						}
						count++;
					}
				}

				if(count >= cfg.to_win){
					return current_user;
				}
			}

			var noone = true;
			for(i=0;i<cfg.width;i++)
				for(j=0;j<cfg.height;j++)
					if(!get(i, j))
						noone = false;
			if(noone)
				return -1;

			return false;
		}
	}
});