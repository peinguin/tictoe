define([
	'underscore',
	'backbone',
	'text!templates/alert.htt',
	'config'
], function(_, Backbone, LayoutText, cfg){
	var Alert = Backbone.View.extend({

    	el: '#alerts',

	    render: function(text, type, ttl){

	    	if(!ttl){
	    		ttl = 1;
	    	}

	    	if(!type){
	    		type = 'error';
	    	}
	    	var data = {
	    		text:text,
	    		type: type,
	    		ttl: ttl
	    	};

	    	var compiledTemplate = _.template( LayoutText, data );
	    	if(this.$el.length == 0){
	    		this.$el = $(this.$el.selector);
	    	}
	    	this.$el.html( compiledTemplate );
	    },

	    empty: function(){
	    	if(this.$el.length == 0){
	    		this.$el = $(this.$el.selector);
	    	}
	    	this.$el.children('div').each(function(){
	    		var el = $(this);
	    		if(!el.attr('data-ttl') || el.attr('data-ttl') == 1){
	    			el.remove();
	    		}else{
	    			el.attr('data-ttl', el.attr('data-ttl') - 1);
	    		}
	    	});
	    }
	});
 	return new Alert;
});