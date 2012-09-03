/**
 * Flow subclass responsible for proper display of XML
 */
define("JsFlow",["./PrettyFlow"],function(PrettyFlow){
	return PrettyFlow.extend({
	
	}, {
		matches : function(data) {
			if (data.contentType)
				return !!data.contentType.match(/xml/i);
			else if (data.path)
				return !!data.path.match(/\.xml/i);
			return false;
		},
		getCategory : function() {
			return "xml";
		}
	});
});
