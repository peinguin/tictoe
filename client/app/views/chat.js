define(
	[
		'backbone',
		'text!templates/chat.htt'
	],
	function(
		Backbone,
		Template
	){
		var ChatView = Backbone.View.extend({
			started: false,
			el:'#chat',

			chat: undefined,

			render: function () {
				if(this.$el.length < 1)
					this.$el = $('#chat');
				this.$el.html(_.template(Template));

				var view = this;

				this.$el.find('form').on('submit', function(e){
					e.preventDefault();

					if(view.chat){
						view.chat(e.target.message.value);
					}
				});
			},
			write: function(text){
				$('#communion').append($('<p></p>').html(text));
			}
		});
		return new ChatView;
	}
);