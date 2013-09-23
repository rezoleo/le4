define(['backbone', 'handlebars', 'text!../templates/leos.html'],
function(Backbone, Handlebars, LeosTemplate) {
	return Backbone.View.extend({
		el: '#results',
		template: Handlebars.compile(LeosTemplate),
		initialize: function() {
			this.listenTo(this.collection, 'reset', this.render);
		},
		render: function() {
			this.$el.html(this.template(this.collection.toJSON()));

			this.$('li:first-child').addClass('active');
			this.collection.length ? this.collection.models[0].set('selected', true) : $('#leo').html('');
		},
		events: {
			'click a': 'select'
		},
		select: function(e) {
			var model;
			(model = this.collection.findWhere({selected: true})) && model.set('selected', false);
			(model = this.collection.get(e.target.attributes._id.value)) && model.set('selected', true);

			this.$('.active').removeClass('active');
			$(e.target).parent().addClass('active');

			e.preventDefault();
		}
	})
});