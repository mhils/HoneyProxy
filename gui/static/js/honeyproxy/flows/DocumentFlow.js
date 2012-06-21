HoneyProxy.DocumentFlow = HoneyProxy.Flow.extend({
	getCategory: function(){
		return "document";
	}
	
}, {matches: function(data){
	if(data.contentType)
		return !!data.contentType.match(/text/i);
	return false;
}});
HoneyProxy.flowModels.unshift(HoneyProxy.DocumentFlow);