define(['backbone', '../models/machine'],
function(Backbone, Machine) {
	return Backbone.Collection.extend({
		model: Machine,
		url: function() {
			return this.url = '/rest/users/' + App.Leos.findWhere({machines: this}).id + '/machines';
		},
		comparator: 'name'
	});
});