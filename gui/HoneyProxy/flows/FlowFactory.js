define(["dojo/_base/declare","./Flow"],function(declare, Flow){
	
	FlowFactory = declare(null, {
		constructor: function(args){
			declare.safeMixin(this,args);
			this.defaultView = this.defaultView || this.views[0];
		}
		createFlow: function(json){
			//console.debug("createFlow",json);
			
			var flow = new Flow(json);
			
			//console.debug(flow);
			
			var View = _.find(this.views,function(v){
				return v.matches(json);
			});
			View = View || this.defaultView;
			
			//console.debug("View Class: ",View);
			
			flow.view = View(flow);
			
			return flow;
		}
	});
	
	return FlowViewFactory;
});