/**
 * Flow subclass responsible for proper display of images
 */
HoneyProxy.ImageFlow = HoneyProxy.Flow.extend({
	getCategory: function(){
		return "image";
	},
	getPreview: function(){
		var html = HoneyProxy.template("flows/image",{
			"response": this.response
			});	
		return html;
	}

}, {matches: function(data){
	if(data.contentType)
		return !!data.contentType.match(/image/i);
	else if(data.path)
		return !!data.path.match(/\.(gif|png|jpg|jpeg)$/i);
	return false;
}});
HoneyProxy.flowModels.unshift(HoneyProxy.ImageFlow);
HoneyProxy.loadTemplate("flows/image");