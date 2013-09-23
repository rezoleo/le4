define(['backbone', 'handlebars', 'text!../templates/machine.html'],
function(Backbone, Handlebars, MachineTemplate) {
	return Backbone.View.extend({
		tagName: 'tr',
		template: Handlebars.compile(MachineTemplate),
		initialize: function() {
			this.listenTo(App.Room, 'reset', this.remove);

			this.render();
		},
		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
		},
		events: {
			'click button': 'authorize'
		},
		authorize: function() {
			var self = this;
			this.model.set('leoId', App.Room.get('leoId'));
			this.model.save(null, {
				success: function() {
					self.remove();
				}
			});
		}
	});
});