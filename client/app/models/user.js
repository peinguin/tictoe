define([
	'backbone',
	'views/enter_username_popup'
], function(Backbone, EnterUsernamePopupView) {
  
	var UserModel = Backbone.Model.extend({

		defaults: {
	        username: undefined,
	        local : undefined
	    },

	    Introduce: function(after) {
	   		var enterUsernamePopupView = new EnterUsernamePopupView;
	   		enterUsernamePopupView.User = this;
			enterUsernamePopupView.render(after);
	    },

		initialize:function(){
			var User = this;
			User.on('change:username', function(){
				if(User.get('username') !== undefined){
					if(User.get('local') === undefined)
						User.set('local', true);
				}
			});
			User.on("change:local", function(){
				if(
					User.get('local') === false
				){
					//connect
				}
			});
		}
	});

	return UserModel;
});
