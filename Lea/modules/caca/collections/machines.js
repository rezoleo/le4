define(['backbone', '../models/machine'],
function(Backbone, Machine) {
	return Backbone.Collection.extend({
		model: Machine
	});
});