define(['backbone', 'underscore', '../collections/machines', '../views/room'],
function(Backbone, _, Machines, RoomView) {
	return Backbone.Model.extend({
		defaults: {
			uid: '',
			first_name: '',
			last_name: '',
			room_id: ''
		},
		url: '/rest/pending',
		initialize: function() {
			this.listenTo(this, 'sync', this.createMachines);
			
			new RoomView({
				model: this
			});
		},
		createMachines: function() {
			var machines;
			_.isArray(machines = this.get('machines')) && this.set('machines', new Machines(machines));
		}
	});
});