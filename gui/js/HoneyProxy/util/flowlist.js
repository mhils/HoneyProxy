/**
 * Utility function that creats a flow list of the given flow ids
 */
define([
	"require",
	"dojo/dom-construct",
	"dojo/on",
	"lodash",
	"../MainLayout"
],function(require, domConstruct, on, _, MainLayout){
	return function(flows, filter) {
		var ul = domConstruct.create("ul", {
			className: "flowlist"
		});

		_.each(flows, function(flow) {
			var li = domConstruct.create("li", {
				'data-flow-id': flow.id
			}, ul);
			li.textContent = flow.response.contentLengthFormatted + " - "
					+ flow.request.date;
		});
		
		if(ul.children.length > 0){
			on(ul,"li:click",function(e){
				//TODO: Use dojo attr (flow-id vs flowId seems unreliable)
				MainLayout.trafficPane.selectFlow(e.target.dataset.flowId);
			});
		}
		
		return ul;
	}

});