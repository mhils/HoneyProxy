/**
 * Flow subclass responsible for proper display of images
 */
define(["../models/Flow","require"],function(Flow,require){

	function preview(parentPreviewFunc){
		return function(){
			var flow = this;
			
			var ul_id = _.uniqueId("notModified");
			var out = $("<div>").append("<h3>Similar Flows with Content:</h3>").append($("<ul>").attr("id", ul_id));
			
			require(["../traffic"],function(traffic){
				flow.getSimilarFlows(3,function(ids){
					var similarFlows = $("#"+ul_id);
					_.each(ids,function(i){
						var f = traffic.get(i);
						if(f.request.contentLength == 0)
							similarFlows.append($("<li>").text(f.id));
					});
				});
			});
			
			var parentPreview = parentPreviewFunc.apply(this,arguments);
			return parentPreview + out.html();
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