/**
 * Our main traffic table showing all flows.
 */
define(["./FlowView"],function(FlowView){
	return Backbone.Marionette.CollectionView.extend({
		  itemView: FlowView
	});
});