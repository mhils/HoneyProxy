HoneyProxy.CSSFlow = HoneyProxy.DocumentFlow.extend({
	getCategory: function(){
		return "css";
	}
}, {matches: function(data){
	if(data.contentType)
		return !!data.contentType.match(/css/i);
	return false;
}});
HoneyProxy.flowModels.push(HoneyProxy.CSSFlow);