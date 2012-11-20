/**
 * Flow subclass responsible for proper display of JavaScript
 */
define(["dojo/Deferred","./PrettyFlow","./DocumentFlow"],function(Deferred,PrettyFlow, DocumentFlow){
	return PrettyFlow.extend({
		getPreview : function(){
			var deferred = new Deferred();
			DocumentFlow.prototype.getPreview.call(this).then(function(pre){
				//Indent JSON
				var contentLength = pre.textContent.length;
				if(contentLength < PrettyFlow.askPretty) {
					try {
						var json = JSON.parse(pre.textContent);
						pre.textContent = JSON.stringify(json,null,"  ");
					} catch(e){}
				}
				PrettyFlow.prototype.prettyPrint.call(this,pre)
				.then(deferred.resolve.bind(deferred));
			});
			return deferred;
		}
	}, {
		matches : function(data) {
			if (data.contentType)
				return !!data.contentType.match(/(javascript|json)/i);
			else if (data.path)
				return !!data.path.match(/(\.js|\.json)$/i);
			return false;
		},
		getCategory : function() {
			return "js";
		}
	});
});
