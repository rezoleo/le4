define(['backbone', './collections/leos', './models/searchbar','./models/leo' , './views/modal.machine', 'text!./app.html'],
function(Backbone, Leos, SearchBar, Leo, ModalMachineView, AppHtml) {
	return Backbone.Router.extend({
		initialize: function() {
			App = this;
			$('#module').html(AppHtml);
			ModalMachineView.initialize();
			
			this.Leos = new Leos;
			new SearchBar;

			// Backbone.history.start();
		},
		routes: {
			// ...
		}
	});
});