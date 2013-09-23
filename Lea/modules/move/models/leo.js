define(['backbone', '../views/leo'],
function(Backbone, LeoView) {
	return Backbone.Model.extend({
		url: '/rest/leos',
		idAttribute: '_id',
		initialize: function() {
			new LeoView({
				model: this
			});
		}
	});
});