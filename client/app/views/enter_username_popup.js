define([
	'underscore',
	'backbone',
	'text!templates/enter_username_popup.htt',
	'fancybox',
	'css!fancybox_css'
], function(
	_,
	Backbone,
	LayoutText,
	fancybox,
	fancybox_css
){
	var EnterUsernameView = Backbone.View.extend({
    	el: '#enter_username',
    	User: undefined,

	    render: function(after){
	    	$.fancybox({
	    		closeBtn: false,
	    		type: 'html',
	    		helpers: {
	    			overlay:{
	    				closeClick: false
	    			}
	    		},
	    		content: LayoutText
	    	});

	    	this.$el = $('#enter_username');
	    	view = this;

	    	var afterset = function(){
	    		$.fancybox.close();
	    		if(after)
	    			after();
	    	}

	    	this.$el.find('#local').click(function (e) {
	    		e.preventDefault();

	    		view.$el.removeClass('error');
	    		var help_inline = view.$el.find('.help-inline');
	    		help_inline.empty();

	    		var username = $.trim(view.$el.find('input').val());

	    		if(username.length < 1){
	    			help_inline.text('Username Required');
	    			view.$el.addClass('error');
	    		}else{
	    			view.User.set('username', username);
	    			afterset();
	    		}
	    	});

	    	this.$el.find('#foreign').click(function (e) {
	    		e.preventDefault();
	    		view.User.set('local', false);
	    		afterset();
	    	})
	    }
	});
 	return EnterUsernameView;
});