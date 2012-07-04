HoneyProxy.DocumentFlow = HoneyProxy.Flow.extend({
	getCategory: function(){
		return "document";
	},
	getPreview: function(){
		var pre_id = _.uniqueId("preview");
		var $pre = $("<pre>").attr("id",pre_id).addClass("preview").text("Loading...");
		this.getResponseContent(function(data){
			$("#"+pre_id).text("Content: \n"+data);
		});
		return $('<div>').append($pre).html();
	}
}, {matches: function(data){
	if(data.contentType)
		return !!data.contentType.match(/application|text/i);
	return false;
}});
HoneyProxy.flowModels.unshift(HoneyProxy.DocumentFlow);