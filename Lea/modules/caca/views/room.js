define(['backbone', 'handlebars', './machine', 'text!../templates/room.html'],
function(Backbone, Handlebars, MachineView, RoomTemplate) {
	return Backbone.View.extend({
		el: '#room',
		template: Handlebars.compile(RoomTemplate),
		initialize: function() {
			this.listenTo(this.model, 'sync', this.render);
		},
		render: function() {
			this.$el.html(this.template(this.model.toJSON()));

			var self = this;
			this.model.get('machines').each(function(machine) {
				self.$el.find('#machines').append((new MachineView({
					model: machine
				})).el);
			});
		}
	});
});