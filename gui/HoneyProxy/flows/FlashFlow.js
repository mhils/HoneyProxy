/**
 * Flow subclass responsible for proper display of flash flows
 */
define([
    "dojo/_base/declare",
	"dojo/Deferred",
	"../util/_DynamicTemplatedWidget",
    "../models/Flow",
    "dojo/text!./templates/binary.ejs"
],function(declare,Deferred,_DynamicTemplatedWidget,Flow,template){
	
	var FlashPreview = declare([_DynamicTemplatedWidget], {
		templateString: template
	});
	
	return Flow.extend({
		getPreview : function() {
			var preview = new FlashPreview({
			  name:"Flash file",
		      model:this
			});
			return (new Deferred()).resolve(preview.domNode);
		}
	}, {
		matches : function(data) {
			if (data.contentType)
				if(!!data.contentType.match(/application\/x-shockwave-flash/i))
				  return true;
			else if (data.path)
				return !!data.path.match(/\.(swf)$/i);
			return false;
		},
		getCategory : function() {
			return "flash";
		}
	});
});