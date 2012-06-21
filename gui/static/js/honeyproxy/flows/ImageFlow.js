HoneyProxy.ImageFlow = HoneyProxy.Flow.extend({
	getCategory: function(){
		return "image";
	}
	
}, {matches: function(data){
	if(data.contentType)
		return !!data.contentType.match(/image/i);
	return false;
}});
HoneyProxy.flowModels.push(HoneyProxy.ImageFlow);