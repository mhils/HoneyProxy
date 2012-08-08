requirejs.config({
    baseUrl: './js/lib',
    paths: {
        HoneyProxy: '../HoneyProxy',
        template: '../../templates',
        jquery: 'jquery-1.7.2'
    },
    shim: {
    	'underscore': {
            exports: '_'
        },
        'backbone': {
            //These script dependencies should be loaded before loading
            //backbone.js
            deps: ['underscore', 'jquery'],
            //Once loaded, use the global 'Backbone' as the
            //module value.
            exports: 'Backbone'
        }
    }
});
require(["backbone"], function(jq) {
    console.log("hooray",jq);
});