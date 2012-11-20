/**
 * Flow subclass responsible for proper display of images
 */
define(["require",
        "dojo/on",
        "dojo/query",
        "dojo/dom-construct",
        "dojo/Deferred",
        "../models/Flow"],function(require,on,query,domConstruct,Deferred,Flow){

	function preview(parentPreviewFunc){
		return function(){
			var deferred = new Deferred();
			var flow = this;
			
			require(["../traffic","../MainLayout"],function(traffic,MainLayout){
				flow.getSimilarFlows(3,function(ids){
					var similarFlows = domConstruct.create("span");
					var ul = domConstruct.create("ul",{className:"flowlist"});
					
					_.each(ids,function(i){
						var f = traffic.get(i);
						if(f.response.contentLength > 0){
							var li = domConstruct.create(
									"li",{'data-flow-id': i},ul);
							li.innerText = f.response.contentLengthFormatted + " - " + f.request.date;
						}
							
					});
					if(ul.children.length > 0){
						domConstruct.place("<h3>Similar Flows with Content:</h3>",similarFlows);
						domConstruct.place(ul,similarFlows);
					} else {
						domConstruct.place("<p>No similar flows found.</p>",similarFlows)
					}
					
					on(ul,"li:click",function(e){
						console.log("NotModifiedFlow.li:click",this,arguments);
						MainLayout.selectFlow($(e.target).data("flow-id"));
					});
					
					var parentPreview = parentPreviewFunc.apply(this,arguments).then(function(content){
						var span = domConstruct.create("span");
						domConstruct.place(content,span);
						domConstruct.place(similarFlows,span);
						deferred.resolve(span);
					});
				});
			});
			return deferred;
		}
	}	
	
	return Flow.extend({
		getPreview : preview(Flow.prototype.getPreview),
		getPreviewEmpty : preview(Flow.prototype.getPreviewEmpty)
	}, {
		matches : function(data) {
			if (data.responseCode)
				return (data.responseCode == 304);
			return false;
		},
		getCategory : function() {
			return "not-modified";
		}
	});
});