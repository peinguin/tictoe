define([
		'router',
		'views/layout',
		'models/user'
	], function(Router, Layout, User){
		var initialize = function(){
			Layout.render();
			Router.initialize();
	}
	return { initialize: initialize };
});