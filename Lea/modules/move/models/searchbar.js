define(['backbone', '../views/searchbar'],
function(Backbone, SearchBarView) {
	return Backbone.Model.extend({
		defaults: {
			uid: ''
		},
		initialize: function() {
			this._attributes = this.defaults;

			new SearchBarView({
				model: this
			});
		}
	});
});