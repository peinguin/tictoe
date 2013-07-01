define(
	[
		'models/user',
		'backbone'
	],
	function (UserModel, Backbone) {
		var UsersCollection = Backbone.Collection.extend({
			model: UserModel
		});
		return UsersCollection;
	}
);