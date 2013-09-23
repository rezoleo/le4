define(['backbone', 'underscore', '../collections/machines', '../views/leo'],
function(Backbone, _, Machines, LeoView) {
	return Backbone.Model.extend({
		idAttribute: '_id',
		defaults:  {
			selected: false,
			loaded: false
		},
		initialize: function() {
			this.listenTo(this, 'change:machines', this.createMachines);

			new LeoView({
				model: this
			});
		},
		createMachines: function() {
			var machines;
			_.isArray(machines = this.get('machines')) && this.set('machines', new Machines(machines));
		}
	});
});
