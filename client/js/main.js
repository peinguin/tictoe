require.config({

    baseUrl: 'lib',

    paths: {
        app: '../app/app',
        router: '../app/router',
        views: '../app/views',
        models: '../app/models',
        templates: '../app/templates',
        config: '../app/config',
        controllers: '../app/controllers',
        collections: '../app/collections',

        jquery: 'jquery-2.0.2.min',

        bootstrap: 'bootstrap/js/bootstrap',
        bootstrap_css: 'bootstrap/css/bootstrap.min',
        main_css : '../css/main',

        underscore: 'underscore-min',
        backbone: 'backbone-min',

        fancybox: 'fancybox/source/jquery.fancybox.pack',
        fancybox_css: 'fancybox/source/jquery.fancybox'
    },
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: ["underscore", "jquery"],
            exports: "Backbone"
        }
    }
});

require([
        'app',
        'jquery',
        'css!bootstrap_css',
        'css!main_css'
    ],
    function(App, $) {

        jQuery.ajaxSetup({
            xhrFields: {
                withCredentials: true
            }
        });

        App.initialize();
    }
);