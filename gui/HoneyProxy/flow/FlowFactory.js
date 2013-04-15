define(["dojo/_base/declare","lodash","./views/all"],function(declare, _, allViews){
	
	var FlowFactory = declare(null, {
		constructor: function(args){
			declare.safeMixin(this,args);
			this.defaultView = this.defaultView || this.views[this.views.length-1];
		},
		createFlow: function(flowData){
		  
		  var flow = new Flow(flowData);
		  
		  var View = _.find(this.views,function(v){
		    return v.matches(flow);
		  });
		  
		  View = View || this.defaultView;
		  
		  flow.View = View;
		  
		  return flow;
		}
	});
	
	return new FlowFactory({views: allViews});
});