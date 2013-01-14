define(["lodash","./Flow","../utilities","../flows/flowModels","dojo/Deferred"],function(_,Flow,utilities,flowModels,Deferred){
	
	/**
	 * A modelFactory factory
	 * the returned factory returns a new instance of the model that .matches() the given arguments
	 */
	function modelFactory(models,fallback,aggregator) {
		
		/**
		 * Create an instance of Cls with the given arguments
		 */
		function newCall(Cls,args){
			//based on http://stackoverflow.com/a/8843181/934719
			return new (Function.bind.apply(Cls, 
					[0].concat(Array.prototype.slice.call(args)))
					)();
		}
		
		return function factory() {
			var data = aggregator.apply(this,arguments); //aggregated data from flows.
			
			var model = _.find(models,function(m){
				if("matches" in m) {
					var x = m.matches(data);
					return x;
				}
				return false;
			});
			model = model || fallback;
	
			return newCall(model,arguments);
		};
		
	}
	
	/**
	 * Factory for flows.
	 * Returns an instance of Flow or an instance of a subclass of Flow
	 * that .matches() the given flow data.
	 */
	var flowFactory = modelFactory(
			flowModels,
			Flow,
			function aggregate(data){
				return {
					contentType : utilities.getContentTypeFromHeaders(data.response.headers),
					path : data.request.path,
					responseCode: data.response.code
				};
			});
	/**
	 * HoneyProxy Traffic Model - Stores a list of flows.
	 * A new flow gets created from data with the flowFactory.
	 */
	var Traffic = Backbone.Collection.extend({
		initialize: function(){
			this.firstFlow = new Deferred();
			var firstFlowTrigger = function() {
				if(this.length > 0) {
					this.firstFlow.resolve("firstflow");
					this.off("newflow",firstFlowTrigger);
					this.off("reset",firstFlowTrigger);
				}
			};
			this.on("add",firstFlowTrigger);
			this.on("reset",firstFlowTrigger);
		},
		model: flowFactory
	});
	
	return Traffic;
});