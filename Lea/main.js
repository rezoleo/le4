require.config({
	paths: {
		jquery: 'libs/jquery-min',
		backbone: 'libs/backbone-min',
		underscore: 'libs/underscore-min',
		handlebars: 'libs/handlebars',
		text: 'libs/text',
		bootstrap: 'libs/bootstrap.min'
	},
	shim: {
		jquery: {
			exports: '$'
		},
		backbone: {
			deps: ['jquery', 'underscore'],
			exports: 'Backbone'
		},
		underscore: {
			exports: '_'
		},
		handlebars: {
			exports: 'Handlebars'
		},
		bootstrap: {
			deps: ['jquery']
		} 
	}
});

//require.onError = function() {alert();};
require(['modules' + location.pathname + '/app', 'bootstrap'], function(App) {
	new App;
});