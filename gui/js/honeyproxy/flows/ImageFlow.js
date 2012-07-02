HoneyProxy.ImageFlow = HoneyProxy.Flow.extend({
	getCategory: function(){
		return "image";
	},
	getPreview: function(){
		//var contentType = this.getContentType() || "image/"+this.getFilename().split(".").pop();
		//contentType = contentType.replace(/[^a-zA-Z0-9\/]/g,"");
		return '<img src="'+this.getResponseContentViewURL()+'" alt="preview" >';
	}
	
}, {matches: function(data){
	if(data.contentType)
		return !!data.contentType.match(/image/i);
	else if(data.path)
		return !!data.path.match(/\.(gif|png|jpg|jpeg)$/i);
	return false;
}});
HoneyProxy.flowModels.unshift(HoneyProxy.ImageFlow);