// Filename: views/layout
define([
	'underscore',
	'backbone',
	'text!templates/layout.htt',
	'models/user'
], function(_, Backbone, LayoutText, css, User){
	var Layout = Backbone.View.extend({
    	el: "body",

	    render: function(){
	      
	    	var data = {
	    		user: User
	    	};

	    	var compiledTemplate = _.template( LayoutText, data );
	    	this.$el.html( compiledTemplate );
	    }
	});
 	return new Layout;
});