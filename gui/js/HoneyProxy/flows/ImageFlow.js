/**
 * Flow subclass responsible for proper display of images
 */
define([
    "dojo/_base/declare",
	"dojo/Deferred",
	"../util/_DynamicTemplatedWidget",
    "../models/Flow",
    "dojo/text!./templates/image.ejs"
],function(declare,Deferred,_DynamicTemplatedWidget,Flow,template){
	
	var ImagePreview = declare([_DynamicTemplatedWidget], {
		templateString: template,
		postCreate: function(){
			this.inherited(arguments);
			//TODO: Replace jquery with dojo
			$(this.imageNode).load((function(){
				this.dimensionsNode.textContent = this.imageNode.naturalWidth + " \xd7 " + this.imageNode.naturalHeight;
			}).bind(this));
		}
	});
	
	return Flow.extend({
		getPreview : function() {
			var preview = new ImagePreview({
				model:this
			});
			return (new Deferred()).resolve(preview.domNode);
		}
	}, {
		matches : function(data) {
			if (data.contentType)
				return !!data.contentType.match(/image/i);
			else if (data.path)
				return !!data.path.match(/\.(gif|png|jpg|jpeg)$/i);
			return false;
		},
		getCategory : function() {
			return "image";
		}
	});
});