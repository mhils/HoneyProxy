(function(){	
	/**
	 * A model factory factory
	 * the returned factory returns a new instance of the model that .matches() the given arguments
	 * FIXME: docs
	 */
	function modelFactory(models,fallback,aggregator) {
		
		/**
		 * Create an instance of Cls with the given arguments
		 */
		function newCall(Cls,args){
			//based on http://stackoverflow.com/a/8843181/934719
			return new (Function.bind.apply(Cls, 
					[0].concat(Array.prototype.slice.call(args))) //[0].concat(arguments.asArray())
					);
		}
		
		return function factory() {
			var data = aggregator.apply(this,arguments);
			
			var model = _.find(models,function(m){
				if("matches" in m) {
					var x = m.matches(data);
					return x;
				}
				return false;
			});
			model = model || fallback;
	
			return newCall(model,arguments);
		}
		
	}
	
	HoneyProxy.flowFactory = modelFactory(
			HoneyProxy.flowModels,
			HoneyProxy.Flow,
			function aggregate(data){
				return {
					contentType : HoneyProxy.getContentTypeFromHeaders(data.response.headers),
					path : data.request.path
				}
			});
		
	HoneyProxy.Traffic = Backbone.Collection.extend({
		  model: HoneyProxy.flowFactory
	});
})();