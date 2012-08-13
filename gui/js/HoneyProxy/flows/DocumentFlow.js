/**
 * Flow subclass responsible for proper display of general files.
 * Basically loading file content into a pre tag.
 * Most other flow classes inherit from this. 
 */
HoneyProxy.DocumentFlow = HoneyProxy.Flow.extend({
	getCategory: function(){
		return "document";
	},
	getPreview: function(callback){
		var pre_id = _.uniqueId("preview");
		var $pre = $("<pre>").attr("id",pre_id).addClass("preview").text("Loading...");
		this.response.getContent(function(data){
			var $pre = $("#"+pre_id).text(data);
			if(_.isFunction(callback))
				callback($pre);
		});
		return $('<div>').append($pre).html();
	}
}, {matches: function(data){
	if(data.contentType)
		return !!data.contentType.match(/application|text/i);
	return false;
}});
HoneyProxy.flowModels.unshift(HoneyProxy.DocumentFlow);