HoneyProxy.XmlFlow = HoneyProxy.PrettyFlow.extend({
	/*getCategory: function(){
		return "xml";
	}*/
}, {matches: function(data){
	if(data.contentType)
		return !!data.contentType.match(/xml/i);
	else if(data.path)
		return !!data.path.match(/\.xml/i);
	return false;
}});
HoneyProxy.flowModels.unshift(HoneyProxy.XmlFlow);