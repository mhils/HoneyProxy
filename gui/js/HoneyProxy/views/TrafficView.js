/**
 * Our main traffic table showing all flows.
 */
HoneyProxy.TrafficView = Backbone.Marionette.CollectionView.extend({
	  itemView: HoneyProxy.FlowView
});