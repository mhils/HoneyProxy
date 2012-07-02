HoneyProxy.DocumentFlow = HoneyProxy.Flow.extend({
	getCategory: function(){
		return "document";
	},
	getPreview: function(){
		var $pre = $("<pre>");
		$pre.text("Loading...");
		this.getResponseContent(function(data){
			console.log(arguments)
			$pre.text("Content: \n"+data);
		});
		return $pre[0];
	}
}, {matches: function(data){
	if(data.contentType)
		return !!data.contentType.match(/application|text/i);
	return false;
}});
HoneyProxy.flowModels.unshift(HoneyProxy.DocumentFlow);