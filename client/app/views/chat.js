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
			render: function () {
				if(this.$el.length < 1)
					this.$el = $('#chat');
				this.$el.html(_.template(Template));
			}
		});
		return new ChatView;
	}
);