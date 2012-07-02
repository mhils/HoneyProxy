HoneyProxy.CSSFlow = HoneyProxy.DocumentFlow.extend({
	getCategory: function(){
		return "css";
	}
}, {matches: function(data){
	if(data.contentType)
		return !!data.contentType.match(/css/i);
	else if(data.path)
		return !!data.path.match(/\.css$/i);
	return false;
}});
HoneyProxy.flowModels.unshift(HoneyProxy.CSSFlow);