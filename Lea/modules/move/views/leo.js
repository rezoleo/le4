define(['backbone', 'handlebars', 'text!../templates/leo.html'],
function(Backbone, Handlebars, LeoTemplate) {
	return Backbone.View.extend({
		el: '#leo',
		template: Handlebars.compile(LeoTemplate),
		initialize: function() {
			this.listenTo(this.model, 'sync', this.render);
		},
		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
		},
		events: {
			'change input': 'update',
			'click button': 'move'
		},
		update: function(e) {
			this.model.set('room', e.target.value);
		},
		move: function() {
			if(this.model.get('room').match(/^(?:[a-f]\d{3}(?:a|b)?|df[1-4])$/)) {
				if(confirm('Are you sure?\nDoing so will potentially remove the previous room owner.')) {
					App.Leo.save({
						success: function() {
							window.location = '../caca';
						}
					});
				}
			}
			else {
				alert('Bad input.');
			}
		}
	});
});