define(['backbone', 'handlebars', './modal.machine', 'text!../templates/machine.html'],
function(Backbone, Handlebars, ModalMachineView, MachineTemplate) {
	return Backbone.View.extend({
		tagName: 'tr',
		template: Handlebars.compile(MachineTemplate),
		initialize: function() {
			this.listenTo(this.model, {
				destroy: this.remove,
				change: this.update
			});

			this.render();
		},
		render: function() {
			this.$el.html(this.template(this.model.toJSON()));

			return this;
		},
		update: function() {
			var attributes = this.model.changedAttributes();
			for(var attr in attributes)
				this.$('.machine_' + attr).html(attributes[attr]);
		},
		events: {
			click: 'showModal'
		},
		showModal: function() {
			ModalMachineView.render(this.model);
		}
	});
});