/**
 * Flow subclass responsible for proper display of images
 */
define(["../models/Flow","require"],function(Flow,require){

	function preview(parentPreviewFunc){
		return function(domPromise){
			var flow = this;
			var location = flow.response.getHeader(/^Location$/i);
			console.warn(flow);
			window.flow = flow;
			var div_id = _.uniqueId("redirectLocation");
			var out = $("<div>").attr("id", div_id);
			
			if(location) {
				require(["../traffic","../MainLayout"],function(traffic,MainLayout){
					var i = flow.id;
					while(i < traffic.length && i < flow.id + 100) {
						var nextFlow = traffic.get(i);
						if(location.indexOf(nextFlow.request.path) >= 0)
							break;
						nextFlow = undefined;
					}
					domPromise.then(function(){
						var container = $("#"+div_id);
						var ul = $("<ul>").addClass("flowlist");

						if(nextFlow){
							ul.append(
									$("<li>")
									.text(nextFlow.response.contentLengthFormatted + " - " + nextFlow.request.date)
									.data("flow-id",nextFlow.id)
							);
							ul.on("click","li",function(e){
								MainLayout.selectFlow($(e.target).data("flow-id"));
							});
							container.append("<h3>Possible subsequent requests:</h3>").append(ul);
						} else {
							container.append("<p>No subsequent requests found.</p>");
						}
					});
				});
			}
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
				return (301 <= data.responseCode && data.responseCode <= 303);
			return false;
		},
		getCategory : function() {
			return "redirect";
		}
	});
});