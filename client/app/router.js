// Filename: router.js
define([
    'backbone',
    'models/user',
    'controllers/game'
], function(
        Backbone,
        User,
        GameController
) {

    var AppRouter = Backbone.Router.extend({
        routes: {
            '*actions': 'defaultAction'
        },
        to_undelegate: []
    });

    var initialize = function() {

        var app_router = new AppRouter;
        app_router.on('route:defaultAction', function() {
            GameController.start();
        });

        Backbone.history.start();
    };
    return {
        initialize: initialize
    };
});
