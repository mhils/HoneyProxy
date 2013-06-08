define(["dojo/_base/declare", "lodash", "dojo/Stateful", "./views/all"], function(declare, _, Stateful, allViews) {

	var FlowFactory = declare(null, {
		constructor: function(args) {
			declare.safeMixin(this, args);
			this.defaultView = this.defaultView || this.views[this.views.length - 1];
		},
		createFlow: function(flow) {

			Object.defineProperty(flow, "filters", {
				value: new Stateful(),
				configurable: false,
				enumerable: false
			});
			["request", "response"].forEach(function(x) {
				Object.defineProperties(flow[x],{
					_flow: {
						value: flow,
						enumerable: false,
						configurable: false,
						writable: false
					},
					_attr: {
						value: x,
						enumerable: false,
						configurable: false,
						writable: false
					}
				});
			});

			//TODO: Caching
			var View = _.find(this.views, function(v) {
				return v.matches(flow);
			});

			View = View || this.defaultView;

			flow.View = View;

			return flow;
		}
	});

	return new FlowFactory({
		views: allViews
	});
});