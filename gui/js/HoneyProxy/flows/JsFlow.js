/**
 * Flow subclass responsible for proper display of JavaScript
 */
define(["./PrettyFlow"],function(PrettyFlow){
	return PrettyFlow.extend({
	
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
