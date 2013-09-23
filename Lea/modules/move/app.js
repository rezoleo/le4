define(['backbone', './models/leo', './models/searchbar', 'text!./app.html'],
function(Backbone, Leo, SearchBar, AppHtml) {
	return Backbone.Router.extend({
		initialize: function() {
			App = this;
			$('#module').html(AppHtml);

			this.Leo = new Leo;
			new SearchBar;

			// Backbone.history.start();
		},
		routes: {
			// ...
		}
	})
});