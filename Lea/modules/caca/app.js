define(['backbone', './models/room', './models/searchbar', 'text!./app.html'],
function(Backbone, Room, SearchBar, AppHtml) {
	return Backbone.Router.extend({
		initialize: function() {
			App = this;
			$('#module').html(AppHtml);

			this.Room = new Room;
			new SearchBar;

			// Backbone.history.start();
		},
		routes: {
			// ...
		}
	})
});