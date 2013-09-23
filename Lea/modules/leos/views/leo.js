define(['backbone', 'handlebars', './machine', './modal.machine', 'text!../templates/leo.html'],
function(Backbone, Handlebars, MachineView, ModalMachineView, LeoTemplate) {
	return Backbone.View.extend({
		el: '#leo',
		template: Handlebars.compile(LeoTemplate),
		initialize: function() {
			this.listenTo(this.model, 'change:selected change:loaded', this.render)
			.listenTo(this.model.collection, 'reset', this.stopListening);
			this.listenToOnce(this.model, 'change:loaded', this.listenToMachines);
		},
		render: function() {
			if(this.model.get('loaded')) {
				this.$el.html(typeof this.template === 'function' ?
				this.template = this.template(this.model.toJSON()) :
				this.template);

				this.model.get('machines').each(function(machine) {
					this.addMachine(machine);
				}, this);
			}
			else {
				this.model.fetch({success: (function() {
					this.set('loaded', true);
				}).bind(this.model)});
			}
		},
		addMachine: function(machine) {
			this.$('tbody').append((new MachineView({
				model: machine
			})).el);
		},
		listenToMachines: function() {
			this.listenTo(this.model.get('machines'), 'add', this.addMachine);
		},
		events: {
			'click tr': 'showModal'
		},
		showModal: function() {
			ModalMachineView.render();
		}
	});
});