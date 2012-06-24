HoneyProxy.DocumentFlow = HoneyProxy.Flow.extend({
	getCategory: function(){
		return "document";
	},
	getPreview: function(){
		return "<h2>"+this.getFilename()+"</h2><pre>Content: "+_.escape(this.getContent())+" </pre>";
	}
}, {matches: function(data){
	if(data.contentType)
		return !!data.contentType.match(/text/i);
	return false;
}});
HoneyProxy.flowModels.unshift(HoneyProxy.DocumentFlow);