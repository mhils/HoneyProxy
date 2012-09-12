/**
 * Flow subclass responsible for proper display of images
 */
define(["../models/Flow","require"],function(Flow,require){

	function preview(parentPreviewFunc){
		return function(){
			var flow = this;
			
			var ul_id = _.uniqueId("notModified");
			var out = $("<div>").attr("id", ul_id);
			
			require(["../traffic","../MainLayout"],function(traffic,MainLayout){
				flow.getSimilarFlows(3,function(ids){
					var similarFlows = $("#"+ul_id);
					var ul = $("<ul>");
					
					_.each(ids,function(i){
						var f = traffic.get(i);
						if(f.response.contentLength > 0)
							ul.append(
									$("<li>")
									.text(f.response.contentLengthFormatted + " - " + f.request.date)
									.data("flow-id",i)
							);
					});
					
					if(ul.children().length > 0){
						similarFlows.append("<h3>Similar Flows with Content:</h3>").append(ul);
					} else {
						similarFlows.append("<p>No similar flows found.</p>");
					}
					
					ul.on("click","li",function(e){
						MainLayout.selectFlow($(e.target).data("flow-id"));
					});
				});
			});
			
			var parentPreview = parentPreviewFunc.apply(this,arguments);
			return parentPreview + $("<div>").append(out).html();
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