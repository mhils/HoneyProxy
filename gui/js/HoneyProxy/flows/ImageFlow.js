/**
 * Flow subclass responsible for proper display of images
 */
define(["dojo/Deferred","../models/Flow","dojo/text!../templates/flows/image.ejs"],function(Deferred,Flow,tmpl){
	
	var template = _.template(tmpl);
	
	return Flow.extend({
		getPreview : function() {
			var html = template({
				"response" : this.response
			});
			return (new Deferred()).resolve(html);
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