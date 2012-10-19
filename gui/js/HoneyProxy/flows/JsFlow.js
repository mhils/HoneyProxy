/**
 * Flow subclass responsible for proper display of JavaScript
 */
define(["./PrettyFlow","./DocumentFlow"],function(PrettyFlow, DocumentFlow){
	return PrettyFlow.extend({
		getPreview : function(domPromise){
			return DocumentFlow.prototype.getPreview.call(this,domPromise,function($pre){
				//Indent JSON
				var contentLength = $pre.html().length;
				console.log(PrettyFlow);
				window.pf = PrettyFlow;
				if(contentLength < PrettyFlow.askPretty) {
					try {
						var json = JSON.parse($pre.html());
						$pre.html(JSON.stringify(json,null,"  "));
					} catch(e){}
				}
				return PrettyFlow.prototype.prettyPrint.call(this,$pre)
			});
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
