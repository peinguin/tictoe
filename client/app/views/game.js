define(
	[
		'underscore',
		'backbone',
		'text!templates/game.htt',
		'config'
	],
	function(
		_,
		Backbone,
		Template,
		cfg
	){
		var GameView = Backbone.View.extend({
			el:'#gamefield',

			step: undefined,

			block: function(){
				$('#gamefield *').attr('disabled', 'disabled');
				$('#gamefield *').off('click');
			},

			unblock: function(){
				var view = this;
				$('#gamefield *').removeAttr('disabled');
				$('#gamefield *').on('click', function(e){
					e.preventDefault();
					if(view.step)
						view.step(e.target);
				});
			},

			resize: function(){

				var view = this;

				var $window = $(window);
				var viewport = {
					width:  $window.width(),
					height: $window.height()
				}

				var game = {};

				var chat_width = Math.floor(viewport.height * 0.2) - 20;
				if(chat_width < 100)
					chat_width = 100;

				if(viewport.width < viewport.height + chat_width){
					game.size = viewport.height - chat_width;
				}else{
					game.size = viewport.height;
				}

				game.size -= 20;

				$('#chat').css('width', chat_width);
					$('#chat textarea').css({'width': chat_width - 20});
					$('#communion').css({'height': viewport.height - 120});

				$('#gamefield').css({width: game.size, height: game.size});
					$('.field').css({
						'width': Math.floor(game.size / cfg.width - 2),
						'height': Math.floor(game.size / cfg.height - 2),
						'line-height': Math.floor(game.size / cfg.width - 2) + 'px',
						'font-size':Math.floor(game.size / cfg.width - 2)
					});
					$('.field:nth-child('+cfg.width+'n)').css('border-right', 'none');
					$(_.map(_.range(cfg.width), function(x){return '.field:nth-child('+((cfg.height - 1)*cfg.width + x + 1)+'n)';}).join(",\n")).css('border-bottom', 'none');

				this.unblock();
			},

			render:function(){

				var view = this;

				var html = _.template(
					Template,
					{
						width:  cfg.width,
						height: cfg.height,
						_ : _
					}
				);

				this.$el.html(html);

				this.resize();
			}
		});
		return GameView;
	}
);