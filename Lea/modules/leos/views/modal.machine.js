define(['backbone', 'underscore', '../models/machine', 'text!../templates/modal.machine.html'],
function(Backbone, _, Machine, ModalMachineHTML) {
	var View = Backbone.View.extend({
		macPattern: /^(?:[0-9a-f]{2}[-: ,;.]?){6}$/i,
		initialize: function() {
			this.setElement('#modal_machine');
			this.$el.html(ModalMachineHTML);

			this.$el.on('hidden', this.resetModal);

			_.bindAll(this, 'closeModal', 'resetModal');
		},
		render: function(model) {
			this.attributes = {};
			
			if(model) {
				this.model = model;
				for(var attr in _.extend({mac: '', alias: ''}, model.attributes))
					this.$('#modal_machine_' + attr).val(model.attributes[attr]);
			}

			this.$el.modal('show');
		},
		events: {
			change: 'updateAttr',
			'click #modal_machine_save': 'saveMachine',
			'click #modal_machine_destroy': 'destroyMachine'
		},
		updateAttr: function(e) {
			this.attributes[e.target.id.substring(14)] = e.target.value;
		},
		saveMachine: function() {
			var mac = this.attributes.mac, machine, machines;
			if(this.model && ((mac && this.macPattern.test(mac)) || !mac))
				this.model.save(this.attributes, {
					wait: true
				}).done(this.closeModal);
			else if(!this.model && mac && this.macPattern.test(mac))
				(machine = new Machine({}, {url: _.result(machines = App.Leos.findWhere({selected: true}).get('machines'), 'url')})).save(this.attributes, {success: (function() {
					delete this.url;
					machines.add(this);
				}).bind(machine)}).done(this.closeModal);
			else
				alert('Incorrect mac value.');
		},
		destroyMachine: function() {
			if(this.model)
				this.model.destroy({
					wait: true
				}).done(this.closeModal);
			else
				alert('You can\'t destroy a non-existing machine. Stupid bitch.');
		},
		closeModal: function() {
			this.$el.modal('hide');
		},
		resetModal: function() {
			this.model = null;
			this.$('form')[0].reset();
		}
	});

	return new View;
});