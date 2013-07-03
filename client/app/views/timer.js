define(['underscore', 'backbone'], function(_, Backbone){
	var TimerView = Backbone.View.extend({
		el:"#timer",
		time: undefined,
		render:function(){
			if(this.time){
				this.$el.text(this.time + 's');
			}
		}
	});
	return TimerView;
});