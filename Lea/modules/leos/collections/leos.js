define(['backbone', '../models/leo', '../views/leos'],
function(Backbone, Leo, LeosView) {
	return Backbone.Collection.extend({
		model: Leo,
		url: '/rest/users',
		initialize: function() {
			new LeosView({
				collection: this
			});
		}
	});
});