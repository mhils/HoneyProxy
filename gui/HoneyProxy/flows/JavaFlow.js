/**
 * Flow subclass responsible for proper display of java flows
 */
define([
    "dojo/_base/declare",
	"dojo/Deferred",
	"../util/_DynamicTemplatedWidget",
    "../models/Flow",
    "dojo/text!./templates/binary.ejs"
],function(declare,Deferred,_DynamicTemplatedWidget,Flow,template){
	
	var JavaPreview = declare([_DynamicTemplatedWidget], {
		templateString: template
	});
	
	return Flow.extend({
		getPreview : function() {
			var preview = new JavaPreview({
			  name:"Flash file",
			  model:this
			});
			return (new Deferred()).resolve(preview.domNode);
		}
	}, {
		matches : function(data) {
			if (data.contentType && !!data.contentType.match(/application\/java-archive/i))
				return true;
			else if (data.path)
				return !!data.path.match(/\.(jar|class)$/i);
			return false;
		},
		getCategory : function() {
			return "java";
		}
	});
});