HoneyProxy.ImageFlow = HoneyProxy.Flow.extend({
	getCategory: function(){
		return "image";
	},
	getPreview: function(){
		return '<img alt="preview" src="data:image/png;base64,'+_.escape(window.btoa(this.getContent()))+'">';
	}
	
}, {matches: function(data){
	if(data.contentType)
		return !!data.contentType.match(/image/i);
	return false;
}});
HoneyProxy.flowModels.unshift(HoneyProxy.ImageFlow);